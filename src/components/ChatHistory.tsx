
import React from "react";
import { useChat, Message } from "./providers/ChatProvider";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

const ChatHistory = () => {
  const { messages, startNewChat } = useChat();
  
  // Group messages by conversation (this is a simplified implementation)
  // In a real app, you'd track conversation IDs
  const conversations = React.useMemo(() => {
    if (messages.length === 0) return [];
    
    // Simple grouping - each user message starts a new "conversation"
    const chats: { id: string; title: string; preview: string; date: Date }[] = [];
    let currentDate = new Date();
    
    // Extract the first few words of the first user message as the title
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].role === "user") {
        const title = messages[i].content.substring(0, 30) + (messages[i].content.length > 30 ? "..." : "");
        const preview = messages[i].content.substring(0, 60) + (messages[i].content.length > 60 ? "..." : "");
        
        chats.push({
          id: messages[i].id,
          title,
          preview,
          date: currentDate
        });
        
        // For demo purposes, offset the date by a random amount
        currentDate = new Date(currentDate.getTime() - Math.random() * 24 * 60 * 60 * 1000);
      }
    }
    
    return chats.reverse();
  }, [messages]);

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
                className="w-full text-left p-3 hover:bg-sidebar-accent rounded-md transition-colors"
              >
                <div className="font-medium text-sm text-sidebar-foreground truncate">
                  {chat.title}
                </div>
                <div className="text-xs text-sidebar-foreground/70 mt-1 truncate">
                  {chat.preview}
                </div>
                <div className="text-xs text-sidebar-foreground/50 mt-1">
                  {chat.date.toLocaleDateString()}
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
