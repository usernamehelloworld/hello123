
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface SidebarToggleProps {
  isOpen: boolean;
  toggle: () => void;
}

const SidebarToggle = ({ isOpen, toggle }: SidebarToggleProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed top-4 left-4 z-50 text-foreground hover:bg-secondary/30"
      onClick={toggle}
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
};

export default SidebarToggle;
