"use client";
import React, { useEffect } from 'react';
import CMSOverview from '@/components/cms/CMSOverview';
import { useAnnouncementStore } from '@/store';

export const CMSDashboard = () => {
  const { isLoading, setLoading } = useAnnouncementStore();
  
  useEffect(() => {
    // Simulate the "Data-Heavy" fetch mentioned in the task
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5 seconds of pulsing skeleton

    return () => clearTimeout(timer);
  }, [setLoading]);

  return (
    <div className="space-y-6">  {/* overview component container */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3 text-white">
          System Overview
        </h1>
        <p className="text-white/40 text-sm mt-1">Content and Advertisement Management.</p>
      </div>

      {/* render overview component*/}
      <CMSOverview isLoading={isLoading}/>
    </div>
  );
};