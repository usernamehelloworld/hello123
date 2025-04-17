
import React, { createContext, useContext, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";

// Declare the global puter object for TypeScript
declare const puter: any;

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
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const MODELS = {
  "puter.js": ["gpt-4o-mini", "gpt-4o", "claude-3-5-sonnet", "gemini-1.5-flash", "pixtral-large-latest"],
  "openrouter": ["openai/gpt-4", "anthropic/claude-3-opus", "mistral/mistral-large"],
  "google-ai-studio": ["gemini-pro", "gemini-ultra", "palm-2"],
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiProvider, setApiProvider] = useState<ApiProvider>("puter.js");
  const [model, setModel] = useState("gpt-4o-mini");
  const [customProviders, setCustomProviders] = useState<string[]>([]);
  const [customProviderModels, setCustomProviderModels] = useState<Record<string, string[]>>({});
  const [customProviderInput, setCustomProviderInput] = useState("");
  const [customModelInput, setCustomModelInput] = useState("");

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
          // Use puter.ai.txt2img (with testMode=true as requested)
          const imageDataUrl = await puter.ai.txt2img(prompt, true);
          assistantMessage = {
            id: uuidv4(),
            role: "assistant",
            content: imageDataUrl, // Store the image data URL
            type: 'image',
          };
        } else {
          // Handle empty prompt case
          assistantMessage = {
            id: uuidv4(),
            role: "assistant",
            content: "Please provide a prompt after the /image command.",
            type: 'text',
          };
        }
      } else {
        // Simulate regular text API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        assistantMessage = {
          id: uuidv4(),
          role: "assistant",
          content: `I'm using the ${apiProvider} provider with the ${model} model.\n\nYour message was: "${content}"\n\nThis is a simulated response since we're not actually connecting to ${apiProvider}.`,
          type: 'text',
        };
      }

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error processing message:", error);
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

  // Start a new chat
  const startNewChat = () => {
    setMessages([]);
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
