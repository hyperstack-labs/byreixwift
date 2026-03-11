import React from 'react';
import { User, Bell } from 'lucide-react';

interface AdminHeaderProps {
  user?: {
    name: string;
    role: string;
  };
}

export const AdminHeader = ({ 
  user = { name: "JoeyCollado", role: "System Admin" } 
}: AdminHeaderProps) => {
  return (
    <header className="h-16 border-b border-white/5 bg-[#0A0A0A]/50 backdrop-blur-md hidden lg:flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="text-white/60 text-[10px] uppercase tracking-[0.3em] font-medium">
        Management Portal
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative text-white/30 hover:text-[#26D578] transition-colors cursor-pointer" title='btn'>
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#26D578] rounded-full" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
        <div className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#26D578]">
            <User size={18} className='cursor-pointer'/>
          </div>
          <div className="text-left cursor-pointer">
            
            <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
            <p className="text-[9px] text-[#26D578] font-bold uppercase tracking-tighter">{user.role}</p>
          </div>
          
        </div>
      </div>
    </header>
  );
};