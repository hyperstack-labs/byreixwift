import React from 'react';
import { Sidebar } from '@/components/cms';
import { AdminHeader } from '@/components/cms';

interface CMSLayoutProps {
  children: React.ReactNode;
}

export const CMSLayout = ({ children }: CMSLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:pt-0 pt-16 px-4 md:px-7">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};