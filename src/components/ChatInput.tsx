
import React, { useState, FormEvent, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useChat } from "./providers/ChatProvider";

const ChatInput = () => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isProcessing } = useChat();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      await sendMessage(input);
      setInput("");
    }
  };

  // Auto resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="sticky bottom-0 w-full bg-background border-t border-border backdrop-blur-sm">
      <form 
        onSubmit={handleSubmit} 
        className="max-w-3xl mx-auto p-4"
      >
        <div className="relative transition-all duration-200">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message ChatGPT..."
            disabled={isProcessing}
            className="pr-12 min-h-[60px] max-h-[200px] rounded-lg resize-none py-3 bg-secondary/50 border-secondary focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            rows={1}
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            disabled={isProcessing || !input.trim()}
            className={`absolute right-2 bottom-2 transition-colors duration-200 ${
              input.trim() ? "text-primary hover:text-primary/80" : "text-muted-foreground"
            }`}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <div className="text-xs text-center text-muted-foreground mt-2">
          ChatGPT can make mistakes. Consider checking important information.
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
