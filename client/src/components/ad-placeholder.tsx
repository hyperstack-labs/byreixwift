import React from 'react';
import { RefreshCw, Megaphone } from 'lucide-react';

interface AdPlaceholderProps {
  isLoading?: boolean;
  isFallback?: boolean;
  onRetry?: () => void; 
}

export const AdPlaceholder = ({ 
  isLoading = false, 
  isFallback = false, 
  onRetry 
}: AdPlaceholderProps) => {
  
  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="w-full min-h-[180px] md:min-h-[200px] bg-[#1A1A1A] border border-white/5 rounded-xl flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-4 w-32 bg-white/5 rounded-full" />
          <div className="h-2 w-20 bg-white/5 rounded-full" />
          <span className="text-[10px] uppercase tracking-widest text-white/20 mt-2">Loading Ad...</span>
        </div>
      </div>
    );
  } 

  // Error/Empty State
  if (isFallback) {
    return (
      <div className="w-full min-h-[180px] md:min-h-[200px] border bg-[#0F0F0F] border-[#1E1E1E] rounded-xl flex flex-col items-center justify-center p-6 text-center space-y-5">
        <div className="space-y-1">
          <p className="text-sm font-medium text-white/70">Content Unavailable</p>
          <p className="text-xs text-white/30">No ad is available at the moment.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          <button 
            onClick={onRetry} aria-label="Retry loading ad"
            className="cursor-pointer flex items-center gap-2 px-5 py-2 text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-white/80 rounded-full border border-white/10 transition-all active:scale-95"
          >
            <RefreshCw size={14} className="text-white/40" /> 
            RETRY
          </button>

          <button aria-label="Advertise here" className="cursor-pointer flex items-center gap-2 px-5 py-2 text-[11px] font-semibold bg-[#26D578]/10 hover:bg-[#26D578]/20 text-[#26D578] rounded-full border border-[#26D578]/30 transition-all active:scale-95">
            <Megaphone size={14} /> 
            ADVERTISE HERE
          </button>
        </div>
      </div>
    );
  }

  return null;
};