
import React, { useState } from "react";
import { useChat, ApiProvider } from "./providers/ChatProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Save, Settings, History } from "lucide-react";
import ChatHistory from "./ChatHistory";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const {
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
  } = useChat();

  // Combined list of providers (default + custom)
  const allProviders = [
    ...Object.keys({"puter.js": [], "openrouter": [], "google-ai-studio": []}),
    ...customProviders
  ];

  return (
    <div
      className={`h-screen fixed left-0 top-0 z-30 w-64 bg-sidebar transition-transform duration-300 ease-in-out border-r border-sidebar-border ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <h2 className="text-xl font-semibold text-gradient">AI Chat</h2>
        <Settings className="w-5 h-5 text-sidebar-foreground/70" />
      </div>

      <Tabs defaultValue="api" className="w-full">
        <div className="px-2 pt-2 border-b border-sidebar-border">
          <TabsList className="w-full bg-sidebar-accent">
            <TabsTrigger value="api" className="flex-1 data-[state=active]:bg-sidebar-primary/20">
              <Settings className="h-4 w-4 mr-2" />
              API Settings
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1 data-[state=active]:bg-sidebar-primary/20">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-132px)]">
          <TabsContent value="api" className="p-4 mt-0 space-y-6 animate-fade-in">
            {/* API Provider Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-sidebar-foreground/90">
                API Provider
              </label>
              <Select 
                value={apiProvider} 
                onValueChange={(value) => setApiProvider(value as ApiProvider)}
              >
                <SelectTrigger className="bg-sidebar-accent text-sidebar-foreground border-sidebar-border">
                  <SelectValue placeholder="Select API Provider" />
                </SelectTrigger>
                <SelectContent className="bg-sidebar-accent text-sidebar-foreground border-sidebar-border">
                  {allProviders.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Model Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-sidebar-foreground/90">
                Model
              </label>
              <Select 
                value={model} 
                onValueChange={setModel}
                disabled={availableModels.length === 0}
              >
                <SelectTrigger className="bg-sidebar-accent text-sidebar-foreground border-sidebar-border">
                  <SelectValue placeholder={availableModels.length === 0 ? "No models available" : "Select Model"} />
                </SelectTrigger>
                <SelectContent className="bg-sidebar-accent text-sidebar-foreground border-sidebar-border">
                  {availableModels.map((modelOption) => (
                    <SelectItem key={modelOption} value={modelOption}>
                      {modelOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-sidebar-border" />

            {/* Custom Provider Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-sidebar-foreground/90">
                Custom API Provider Name
              </label>
              <div className="flex space-x-2">
                <Input
                  value={customProviderInput}
                  onChange={(e) => setCustomProviderInput(e.target.value)}
                  className="bg-sidebar-accent text-sidebar-foreground border-sidebar-border"
                  placeholder="Enter provider name"
                />
                <Button
                  size="icon"
                  variant="outline"
                  className="bg-sidebar-accent border-sidebar-border hover:bg-sidebar-accent/70"
                  onClick={saveCustomProvider}
                  title="Save Custom Provider"
                >
                  <Save className="h-4 w-4 text-sidebar-primary" />
                </Button>
              </div>
            </div>

            {/* Custom Model Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-sidebar-foreground/90">
                Custom Model Name
              </label>
              <div className="flex space-x-2">
                <Input
                  value={customModelInput}
                  onChange={(e) => setCustomModelInput(e.target.value)}
                  className="bg-sidebar-accent text-sidebar-foreground border-sidebar-border"
                  placeholder="Enter model name"
                />
                <Button
                  size="icon"
                  variant="outline"
                  className="bg-sidebar-accent border-sidebar-border hover:bg-sidebar-accent/70"
                  onClick={saveCustomModel}
                  title="Save Custom Model"
                >
                  <Save className="h-4 w-4 text-sidebar-primary" />
                </Button>
              </div>
              <p className="text-xs text-sidebar-foreground/70 mt-1">
                This model will be associated with the selected API provider.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-0 animate-fade-in h-full">
            <ChatHistory />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Sidebar;
