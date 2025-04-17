
import React from "react";
import { Message } from "./providers/ChatProvider";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface ChatMessageProps {
  message: Message;
}

// Define a local CodeProps interface
interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  return (
    <div
      className={cn(
        "py-6 px-4 md:px-8 lg:px-12 flex w-full",
        isUser ? "bg-chat-user" : "bg-chat-assistant"
      )}
    >
      <div className="max-w-3xl mx-auto w-full">
        <div className="flex items-start gap-4 md:gap-6">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
              isUser
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            )}
          >
            {isUser ? "U" : "AI"}
          </div>
          <div className="flex-1 overflow-hidden">
            {message.type === 'image' ? (
              // Render image if type is 'image'
              <img src={message.content} alt="Generated image" className="max-w-full h-auto rounded-md" />
            ) : (
              // Render markdown for text messages
              // Removed prose-purple and dark:prose-invert, using base prose styles from index.css
              <ReactMarkdown
                className="prose" 
                components={{
                  code({ node, inline, className, children, ...props }: CodeProps) {
                  const match = /language-(\w+)/.exec(className || "");
                  const code = String(children).replace(/\n$/, "");

                  if (!inline && match) {
                    return (
                      <div className="relative group">
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                           onClick={() => copyToClipboard(code)}
                           // Updated copy button style for B&W theme
                           className="p-1 rounded bg-black text-white hover:bg-white hover:text-black border border-white"
                           aria-label="Copy code"
                         >
                           <Copy className="h-4 w-4" /> 
                         </button>
                       </div>
                       <SyntaxHighlighter
                          language={match[1]}
                          style={vscDarkPlus}
                          PreTag="div"
                          className="rounded-md !mt-0"
                        >
                          {code}
                        </SyntaxHighlighter>
                      </div>
                    );
                  } else if (inline) {
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  } else {
                    return (
                      <div className="relative group">
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                           onClick={() => copyToClipboard(code)}
                            // Updated copy button style for B&W theme
                           className="p-1 rounded bg-black text-white hover:bg-white hover:text-black border border-white"
                           aria-label="Copy code"
                         >
                           <Copy className="h-4 w-4" />
                         </button>
                       </div>
                       <SyntaxHighlighter
                          language="text"
                          style={vscDarkPlus}
                          PreTag="div"
                          className="rounded-md !mt-0"
                        >
                          {code}
                        </SyntaxHighlighter>
                      </div>
                    );
                  }
                },
                table({ node, ...props }) {
                  return (
                    <div className="overflow-x-auto">
                      <table className="markdown" {...props} />
                      </div>
                    );
                  },
                  // Removed duplicate table definition
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
