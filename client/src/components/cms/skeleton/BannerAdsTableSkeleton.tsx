import React from 'react';

export const BannerAdsTableSkeleton = () => {
  return (
    <div className="w-full space-y-4">
      {/* Table Header  */}
      <div className="hidden md:block h-12 bg-white/5 border-b border-white/5" />
      
      {/* Table Rows  */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex flex-col md:flex-row items-center justify-between p-4 md:px-6 gap-4 border-b border-white/5">
          <div className="flex items-center gap-4 flex-1 w-full">
            {/* Thumbnail Box */}
            <div className="w-11 h-11 bg-white/10 rounded shrink-0" />
            {/* Details Box */}
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-white/10 rounded" />
              <div className="h-3 w-48 bg-white/5 rounded" />
            </div>
          </div>
          {/* Status Toggle Box */}
          <div className="h-6 w-20 bg-white/10 rounded-full hidden md:block" />
          {/* Stats Box */}
          <div className="h-6 w-24 bg-white/10 rounded hidden md:block" />
          {/* Actions Box */}
          <div className="h-6 w-16 bg-white/10 rounded" />
        </div>
      ))}
    </div>
  );
};