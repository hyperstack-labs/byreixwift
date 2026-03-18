"use client";

import React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onConnect: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onConnect, onNavigate }) => {
  return (
    <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="glass-luxury rounded-full px-6 py-2.5 flex items-center gap-8 pointer-events-auto border-white/10"
      >
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onNavigate("hero")}
        >
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:scale-105 transition-transform">
            <span className="text-primary font-black text-xs">BR</span>
          </div>
          <span className="text-sm font-bold tracking-tight text-foreground/90">ByReiXwift</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {["Swap", "Send", "TrendView", "Escrow"].map((item) => (
            <button
              key={item}
              onClick={() => onNavigate(item.toLowerCase())}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest px-2"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-white/10 hidden md:block" />

        <Button
          onClick={onConnect}
          variant="ghost"
          size="sm"
          className="h-9 px-5 rounded-full text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-300 border border-primary/20"
        >
          Connect
        </Button>
      </motion.div>
    </nav>
  );
};
