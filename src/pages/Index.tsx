
import React, { useState, useEffect, useRef } from "react";
import { ChatProvider } from "@/components/providers/ChatProvider";
import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import Sidebar from "@/components/Sidebar";
import SidebarToggle from "@/components/SidebarToggle";
import { useChat } from "@/components/providers/ChatProvider";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// ChatContainer component to separate chat UI from providers
const ChatContainer = () => {
  const { messages, isProcessing } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Check if should show scroll down button
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} />
      
      <main className={`flex-1 flex flex-col relative transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        <SidebarToggle isOpen={isSidebarOpen} toggle={toggleSidebar} />
        
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="max-w-md text-center">
              <h1 className="text-2xl font-bold mb-4 text-gradient">AI Chat Assistant</h1>
              <p className="text-muted-foreground mb-6">
                This is a ChatGPT clone with an enhanced side panel for API and model selection.
              </p>
              <div className="flex justify-center">
                <div className="glass-panel p-4 rounded-lg text-left space-y-3 w-full">
                  <p className="text-sm font-medium">Example prompts:</p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Explain quantum computing in simple terms</li>
                    <li>• Write a short poem about artificial intelligence</li>
                    <li>• How do I make an HTTP request in JavaScript?</li>
                    <li>• Suggest a healthy meal plan for a week</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto"
          >
            <div className="divide-y divide-border">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isProcessing && (
                <div className="py-6 px-4 md:px-8 lg:px-12 flex w-full bg-chat-assistant">
                  <div className="max-w-3xl mx-auto w-full">
                    <div className="flex items-start gap-4 md:gap-6">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 bg-secondary text-secondary-foreground">
                        AI
                      </div>
                      <div className="flex-1">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse-light"></div>
                          <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse-light delay-150"></div>
                          <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse-light delay-300"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>
        )}
        
        {showScrollButton && messages.length > 0 && (
          <Button
            variant="secondary"
            size="icon"
            className="fixed bottom-20 right-4 rounded-full shadow-lg z-10 bg-primary/90 hover:bg-primary"
            onClick={scrollToBottom}
          >
            <ArrowDown className="h-4 w-4 text-primary-foreground" />
          </Button>
        )}
        
        <ChatInput />
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <ChatProvider>
      <ChatContainer />
    </ChatProvider>
  );
};

export default Index;
