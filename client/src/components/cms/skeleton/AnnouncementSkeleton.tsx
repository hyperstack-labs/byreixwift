import React from 'react';

export const AnnouncementSkeleton = () => {
  return (
    <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5">
      <div className="flex gap-4 flex-1 min-w-0">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-white/10 shrink-0" />
        
        <div className="flex-1 space-y-3">
          {/* Title Line */}
          <div className="h-4 w-1/3 bg-white/10 rounded" />
          {/* Message Line */}
          <div className="h-3 w-3/4 bg-white/5 rounded" />
          
          {/* Status and Date */}
          <div className="flex items-center gap-3 mt-2">
            <div className="h-4 w-16 bg-white/5 rounded-full" />
            <div className="h-3 w-24 bg-white/5 rounded" />
          </div>
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex items-center gap-4 self-end md:self-center shrink-0">
        <div className="w-5 h-5 bg-white/5 rounded" />
        <div className="w-5 h-5 bg-white/5 rounded" />
      </div>
    </div>
  );
};