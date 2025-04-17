import React from "react";
import { useChat, Message } from "./providers/ChatProvider";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

interface Conversation {
  id: string;
  title: string;
  preview: string;
  date: Date;
  messages: Message[];
}

const ChatHistory = () => {
  const { messages, startNewChat, restoreChat } = useChat();
  
  // Group messages into conversations
  const conversations = React.useMemo(() => {
    if (messages.length === 0) return [];
    
    const chats: Conversation[] = [];
    let currentConversation: Conversation | null = null;
    
    messages.forEach((message, index) => {
      // Start a new conversation with each user message
      if (message.role === "user") {
        if (currentConversation) {
          chats.push(currentConversation);
        }
        
        currentConversation = {
          id: message.id,
          title: message.content.substring(0, 30) + (message.content.length > 30 ? "..." : ""),
          preview: message.content.substring(0, 60) + (message.content.length > 60 ? "..." : ""),
          date: new Date(),
          messages: [message]
        };
      } else if (currentConversation) {
        currentConversation.messages.push(message);
        // Update preview to include AI response
        if (message.type === 'text') {
          currentConversation.preview = message.content.substring(0, 60) + (message.content.length > 60 ? "..." : "");
        } else if (message.type === 'image') {
          currentConversation.preview = "[Image Generated]";
        }
      }
    });

    // Add the last conversation if exists
    if (currentConversation) {
      chats.push(currentConversation);
    }
    
    return chats.reverse();
  }, [messages]);

  const handleConversationClick = (conversation: Conversation) => {
    restoreChat(conversation.messages);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <button
          onClick={startNewChat}
          className="w-full bg-primary/20 hover:bg-primary/30 text-primary-foreground rounded-md py-2 px-4 flex items-center justify-center transition-colors"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          New Chat
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground text-sm">
            No chat history found
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleConversationClick(chat)}
                className="w-full text-left p-3 hover:bg-sidebar-accent rounded-md transition-colors"
              >
                <div className="font-medium text-sm text-sidebar-foreground truncate">
                  {chat.title}
                </div>
                <div className="text-xs text-sidebar-foreground/70 mt-1 truncate">
                  {chat.preview}
                </div>
                <div className="text-xs text-sidebar-foreground/50 mt-1">
                  {chat.date.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
