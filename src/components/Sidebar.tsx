import React, { useState } from "react";
import { useChat, ApiProvider } from "./providers/ChatProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Save, Settings, History } from "lucide-react";
import { Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
    imageGallery,
    generateImage,
  } = useChat();

  const [imagePrompt, setImagePrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("api");
  const [selectedImage, setSelectedImage] = useState<null | { url: string; prompt: string }>(null);

  const allProviders = [
    ...Object.keys({"puter.js": [], "openrouter": [], "google-ai-studio": []}),
    ...customProviders
  ];

  return (
    <div
      className={`h-screen fixed left-0 top-0 z-30 w-64 bg-black text-white transition-transform duration-300 ease-in-out border-r border-white ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-white">
        <h2 className="text-xl font-semibold">AI Chat</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white/70 hover:bg-white/10 hover:text-white"
          onClick={() => setActiveTab('api')}
          title="Open API Settings"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-2 pt-2 border-b border-white">
          <TabsList className="w-full bg-black">
            <TabsTrigger value="api" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black">
              <Settings className="h-4 w-4 mr-2" />
              API Settings
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="imagegen" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black">
              <ImageIcon className="h-4 w-4 mr-2" />
              Image Generator
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-132px)]">
          <TabsContent value="api" className="p-4 mt-0 space-y-6 animate-fade-in">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">
                API Provider
              </label>
              <Select 
                value={apiProvider} 
                onValueChange={(value) => setApiProvider(value as ApiProvider)}
              >
                <SelectTrigger className="bg-black text-white border-white">
                  <SelectValue placeholder="Select API Provider" />
                </SelectTrigger>
                <SelectContent className="bg-black text-white border-white">
                  {allProviders.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">
                Model
              </label>
              <Select 
                value={model} 
                onValueChange={setModel}
                disabled={availableModels.length === 0}
              >
                <SelectTrigger className="bg-black text-white border-white">
                  <SelectValue placeholder={availableModels.length === 0 ? "No models available" : "Select Model"} />
                </SelectTrigger>
                <SelectContent className="bg-black text-white border-white">
                  {availableModels.map((modelOption) => (
                    <SelectItem key={modelOption} value={modelOption}>
                      {modelOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-white" />

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">
                Custom API Provider Name
              </label>
              <div className="flex space-x-2">
                <Input
                  value={customProviderInput}
                  onChange={(e) => setCustomProviderInput(e.target.value)}
                  className="bg-black text-white border-white"
                  placeholder="Enter provider name"
                />
                <Button
                  size="icon"
                  variant="outline"
                  className="bg-black border-white hover:bg-white/10"
                  onClick={saveCustomProvider}
                  title="Save Custom Provider"
                >
                  <Save className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">
                Custom Model Name
              </label>
              <div className="flex space-x-2">
                <Input
                  value={customModelInput}
                  onChange={(e) => setCustomModelInput(e.target.value)}
                  className="bg-black text-white border-white"
                  placeholder="Enter model name"
                />
                <Button
                  size="icon"
                  variant="outline"
                  className="bg-black border-white hover:bg-white/10"
                  onClick={saveCustomModel}
                  title="Save Custom Model"
                >
                  <Save className="h-4 w-4 text-white" />
                </Button>
              </div>
              <p className="text-xs text-white/70 mt-1">
                This model will be associated with the selected API provider.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-0 animate-fade-in h-full">
            <ChatHistory />
          </TabsContent>

          <TabsContent value="imagegen" className="p-4 animate-fade-in space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Prompt</label>
              <div className="flex space-x-2">
                <Input
                  value={imagePrompt}
                  onChange={e => setImagePrompt(e.target.value)}
                  className="bg-black text-white border-white placeholder:text-white/50"
                  placeholder="Describe your image..."
                  disabled={isGenerating}
                  onKeyDown={e => { if (e.key === 'Enter') handleGenerate(); }}
                />
                <Button
                  size="sm"
                  className="bg-white text-black border-white hover:bg-white/80"
                  disabled={isGenerating || !imagePrompt.trim()}
                  onClick={handleGenerate}
                >
                  {isGenerating ? '...' : 'Generate'}
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-2">Image Gallery</h3>
              {imageGallery.length === 0 ? (
                <div className="text-sm text-white/60">No images generated yet.</div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {imageGallery.map(img => (
                    <div key={img.id} className="cursor-pointer group" onClick={() => setSelectedImage(img)}>
                      <img src={img.url} alt={img.prompt} className="rounded border border-white/20 w-full aspect-square object-cover group-hover:opacity-80 transition" />
                      <div className="text-xs mt-1 truncate" title={img.prompt}>{img.prompt}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
              <DialogContent className="bg-black border-white max-w-lg">
                {selectedImage && (
                  <div>
                    <img src={selectedImage.url} alt={selectedImage.prompt} className="w-full rounded mb-2 border border-white" />
                    <div className="text-xs text-white/80">{selectedImage.prompt}</div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );

  function handleGenerate() {
    if (!imagePrompt.trim()) return;
    setIsGenerating(true);
    generateImage(imagePrompt.trim()).finally(() => {
      setIsGenerating(false);
      setImagePrompt("");
    });
  }
};

export default Sidebar;
