"use client";

import { X, Megaphone, AlertTriangle, Info } from "lucide-react";
import { useState } from "react";
import { useActiveAnnouncement } from "@/store";
import { useIsClient } from "@/hooks";


export function AnnouncementBanner() {
  const activeAnnouncement = useActiveAnnouncement();
  const isClient = useIsClient();

  const [dismissedId, setDismissedId] = useState<number | null>(null);

  const isCurrentlyDismissed = activeAnnouncement && dismissedId === activeAnnouncement.id;

  // if we're on server, no announcement
  if (!isClient || !activeAnnouncement || isCurrentlyDismissed) return null;

  const handleDismiss = () => {
    // record specific ID being dismissed
    setDismissedId(activeAnnouncement.id);
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case "warning":
        return { color: "text-amber-500", icon: <AlertTriangle className="w-4 h-4" /> };
      case "promo":
        return { color: "text-(--byreix-green)", icon: <Megaphone className="w-4 h-4" /> };
      default:
        return { color: "text-blue-500", icon: <Info className="w-4 h-4" /> };
    }
  };

  const config = getTypeConfig(activeAnnouncement.type);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-(--byreix-bg)/80 border-t border-(--byreix-border) shadow-2xl animate-in slide-in-from-bottom duration-500">
      <div className={`h-0.5 w-full bg-current ${config.color} opacity-50`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 text-left">
            <div className={`${config.color} shrink-0`}>{config.icon}</div>
            <p className="text-sm text-(--byreix-text-secondary) truncate">
              <span className="text-white font-bold">{activeAnnouncement.title}</span>
              <span className="mx-2 text-zinc-700">|</span>
              {activeAnnouncement.message}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={handleDismiss}
              className="p-1 text-zinc-500 hover:text-white transition-colors rounded-md hover:bg-white/5 cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
