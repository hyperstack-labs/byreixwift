import React from 'react';

export const AnnouncementSkeleton = () => {
  return (
    <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-(--byreix-border)">
      <div className="flex gap-4 flex-1 min-w-0">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl skeleton-fill shrink-0" />
        
        <div className="flex-1 space-y-3">
          {/* Title Line */}
          <div className="h-4 w-1/3 skeleton-fill rounded" />
          
          {/* Message Line */}
          <div className="h-3 w-3/4 skeleton-fill rounded opacity-70" />
          
          {/* Status and Date */}
          <div className="flex items-center gap-3 mt-2">
            <div className="h-4 w-16 skeleton-fill rounded-full" />
            <div className="h-3 w-24 skeleton-fill rounded opacity-50" />
          </div>
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex items-center gap-4 self-end md:self-center shrink-0">
        <div className="w-5 h-5 skeleton-fill rounded" />
        <div className="w-5 h-5 skeleton-fill rounded" />
      </div>
    </div>
  );
};