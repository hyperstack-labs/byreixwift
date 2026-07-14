"use client";

import React, { ReactNode } from "react";
import { useAdTracking } from "@/hooks";

interface AdSlotProps {
  adId: string;
  children: ReactNode;
  isVisible?: boolean; // show only if ad available
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ adId, children, isVisible = true, className }) => {
  const { elementRef, trackAdClick } = useAdTracking(adId);

  if (!isVisible) return null;

  return (
    <div
      ref={elementRef}
      onClick={trackAdClick}
      className={`ad-slot my-4 cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
};
