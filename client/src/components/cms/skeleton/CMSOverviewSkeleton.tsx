import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui";

export const CMSOverviewSkeleton = () => {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Quick Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="h-10 w-36 bg-white/5 rounded-lg" />
        <div className="h-10 w-32 bg-white/5 rounded-lg" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-(--byreix-surface) border-(--byreix-border) min-w-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-x-2">
              <div className="h-3 w-20 bg-white/10 rounded" />
              <div className="h-5 w-5 bg-white/10 rounded-full shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-14 bg-white/10 rounded mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity List */}
      <Card className="bg-(--byreix-surface) border-(--byreix-border) flex flex-col h-90 overflow-hidden">
        <CardHeader className="border-b border-(--byreix-border) shrink-0 p-6">
          <div className="h-5 w-40 bg-white/10 rounded" />
        </CardHeader>
        
        <CardContent className="pt-6 space-y-5 overflow-y-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-start justify-between px-1">
              <div className="flex items-start gap-4 flex-1">
                {/* Icon Placeholder */}
                <div className="h-8 w-8 bg-white/5 rounded-lg shrink-0" />
                <div className="space-y-2 flex-1 pt-1">
                  <div className="h-3 w-3/4 bg-white/10 rounded" />
                  <div className="h-2 w-1/4 bg-white/5 rounded" />
                </div>
              </div>
              <div className="h-2 w-16 bg-white/5 rounded mt-2 shrink-0" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};