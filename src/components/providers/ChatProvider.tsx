import React, { createContext, useContext, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";

// Declare the global puter object for TypeScript
declare global {
  interface Window {
    puter: {
      ai: {
        chat: (messages: { role: string; content: string }[], options: { model: string; stream: boolean }) => AsyncIterableIterator<{ text: string }>;
        txt2img: (prompt: string, testMode: boolean) => Promise<string>;
      };
    };
  }
}

export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  type?: 'text' | 'image'; // Add type field
};

export type ApiProvider = "puter.js" | "openrouter" | "google-ai-studio" | string;

type ChatContextType = {
  messages: Message[];
  isProcessing: boolean;
  sendMessage: (content: string) => Promise<void>;
  apiProvider: ApiProvider;
  model: string;
  availableModels: string[];
  customProviders: string[];
  customProviderInput: string;
  customModelInput: string;
  setCustomProviderInput: (input: string) => void;
  setCustomModelInput: (input: string) => void;
  saveCustomProvider: () => void;
  saveCustomModel: () => void;
  setApiProvider: (provider: ApiProvider) => void;
  setModel: (model: string) => void;
  startNewChat: () => void;
  restoreChat: (messages: Message[]) => void;
  imageGallery: { id: string; prompt: string; url: string }[];
  generateImage: (prompt: string) => Promise<void>;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const MODELS = {
  "puter.js": ["gpt-4-turbo", "gpt-4", "claude-3-sonnet", "gemini-1.5-pro", "mixtral-8x7b"],
  "openrouter": ["openai/gpt-4", "anthropic/claude-3-opus", "mistral/mistral-large"],
  "google-ai-studio": ["gemini-pro", "gemini-ultra", "palm-2"],
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiProvider, setApiProvider] = useState<ApiProvider>("puter.js");
  const [model, setModel] = useState("gpt-4-turbo");
  const [customProviders, setCustomProviders] = useState<string[]>([]);
  const [customProviderModels, setCustomProviderModels] = useState<Record<string, string[]>>({});
  const [customProviderInput, setCustomProviderInput] = useState("");
  const [customModelInput, setCustomModelInput] = useState("");
  const [imageGallery, setImageGallery] = useState<{ id: string; prompt: string; url: string }[]>([]);

  // Determine available models based on selected API provider
  const availableModels = React.useMemo(() => {
    if (apiProvider in MODELS) {
      return MODELS[apiProvider as keyof typeof MODELS];
    } else if (apiProvider in customProviderModels) {
      return customProviderModels[apiProvider];
    }
    return [];
  }, [apiProvider, customProviderModels]);

  // Save custom provider
  const saveCustomProvider = () => {
    if (customProviderInput.trim() && !customProviders.includes(customProviderInput)) {
      setCustomProviders([...customProviders, customProviderInput]);
      setCustomProviderModels({
        ...customProviderModels,
        [customProviderInput]: [],
      });
      setCustomProviderInput("");
    }
  };

  // Save custom model
  const saveCustomModel = () => {
    if (customModelInput.trim() && !availableModels.includes(customModelInput)) {
      const updatedModels = {
        ...customProviderModels,
        [apiProvider]: [...(customProviderModels[apiProvider] || []), customModelInput],
      };
      setCustomProviderModels(updatedModels);
      setModel(customModelInput);
      setCustomModelInput("");
    }
  };

  // Send a message
  const sendMessage = async (content: string) => {
    if (!window.puter) {
      const errorMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: "The Puter.ai API is not available. Please make sure you're running this in the correct environment.",
        type: 'text',
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
      type: 'text', // User messages are always text
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      let assistantMessage: Message;

      // Check for image generation command
      if (content.startsWith("/image ")) {
        const prompt = content.substring(7).trim(); // Extract prompt after "/image "
        if (prompt) {
          try {
            // Use window.puter.ai.txt2img (with testMode=true as requested)
            const imageDataUrl = await window.puter.ai.txt2img(prompt, true);
            if (!imageDataUrl) {
              throw new Error("Failed to generate image");
            }
            assistantMessage = {
              id: uuidv4(),
              role: "assistant",
              content: imageDataUrl, // Store the image data URL
              type: 'image',
            };
            // Add to image gallery
            setImageGallery(prev => [
              { id: assistantMessage.id, prompt, url: imageDataUrl },
              ...prev,
            ]);
          } catch (imageError) {
            assistantMessage = {
              id: uuidv4(),
              role: "assistant",
              content: `Failed to generate image: ${imageError instanceof Error ? imageError.message : 'Unknown error'}`,
              type: 'text',
            };
          }
        } else {
          // Handle empty prompt case
          assistantMessage = {
            id: uuidv4(),
            role: "assistant",
            content: "Please provide a prompt after the /image command.",
            type: 'text',
          };
        }
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Prepare messages for window.puter.ai.chat()
        // Filter out any potential 'image' type messages from history for chat endpoint
        const chatHistory = [...messages, userMessage]
          .filter(msg => msg.type !== 'image') 
          .map(({ role, content }) => ({ role, content }));

        // --- Streaming Implementation ---
        // Create a placeholder for the assistant message
        const assistantMessageId = uuidv4();
        const initialAssistantMessage: Message = {
          id: assistantMessageId,
          role: "assistant",
          content: "", // Start with empty content
          type: 'text',
        };
        setMessages((prev) => [...prev, initialAssistantMessage]);

        // Call window.puter.ai.chat() with streaming enabled
        const stream = await window.puter.ai.chat(chatHistory, { model, stream: true });

        // Process the stream
        let accumulatedContent = "";
        for await (const part of stream) {
          if (part?.text) {
            accumulatedContent += part.text;
            // Update the specific assistant message content
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: accumulatedContent }
                  : msg
              )
            );
          }
        }
        // --- End Streaming Implementation ---
      }
      // Note: No need to add assistant message here again, it's handled during streaming
    } catch (error) {
      console.error("Error processing message:", error);
      // Keep existing error handling
      // Add an error message to the chat
      const errorMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : String(error)}`,
        type: 'text',
      };
      setMessages((prev) => [...prev, errorMessage]);
      // Handle error (e.g., add error message)
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Sidebar Image Generation ---
  const generateImage = async (prompt: string) => {
    if (!window.puter) return;
    try {
      const imageDataUrl = await window.puter.ai.txt2img(prompt, true);
      if (imageDataUrl) {
        const id = uuidv4();
        setImageGallery(prev => [
          { id, prompt, url: imageDataUrl },
          ...prev,
        ]);
        // Optionally, add to chat as well:
        setMessages(prev => [
          ...prev,
          { id, role: "assistant", content: imageDataUrl, type: 'image' },
        ]);
      }
    } catch (e) {
      // Optionally, handle error
    }
  };

  // Start a new chat
  const startNewChat = () => {
    setMessages([]);
  };

  // Restore a previous chat
  const restoreChat = (chatMessages: Message[]) => {
    setMessages(chatMessages);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isProcessing,
        sendMessage,
        apiProvider,
        model,
        availableModels,
        customProviders,
        customProviderInput,
        customModelInput,
        setCustomProviderInput,
        setCustomModelInput,
        saveCustomProvider,
        saveCustomModel,
        setApiProvider,
        setModel,
        startNewChat,
        restoreChat,
        imageGallery,
        generateImage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
