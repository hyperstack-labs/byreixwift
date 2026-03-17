"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Bell, User } from "lucide-react";
import { ByreixLogo } from "@/components";

const navLinks = [
  { name: "Dashboard Overview", href: "/cms" },
  {
    name: "Banner Ads Management",
    href: "/cms/bannerAdsManagement",
  },
  { name: "Announcements", href: "/cms/announcements" },
  { name: "Settings", href: "/cms/settings" },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b border-border flex items-center justify-between px-6 z-60">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-muted-foreground hover:text-white transition-all active:scale-95 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link href="/" className="cursor-pointer">
            <ByreixLogo className="h-6" />
          </Link>
        </div>

        {/* MOBILE ACTIONS (Merged from AdminHeader) */}
        <div className="flex items-center gap-4">
          <button
            className="relative text-white/30 hover:text-primary transition-colors"
            title="Notifications"
          >
            <Bell size={18} />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full" />
          </button>
          <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary">
            <User size={16} />
          </div>
        </div>
      </div>

      {/* MENU */}
      <aside
        className={`
        fixed z-55 bg-card transition-all duration-300 ease-in-out
        
        /* DESKTOP */
        lg:static lg:inset-y-0 lg:left-0 lg:w-64 lg:min-h-screen lg:opacity-100 lg:border-r lg:border-border lg:translate-y-0
        
        /* MOBILE */
        ${
          isOpen
            ? "top-16 left-0 right-0 opacity-100 translate-y-0 visible border-b border-border max-h-[calc(100vh-64px)] shadow-2xl"
            : "top-16 left-0 right-0 opacity-0 -translate-y-4 invisible lg:visible"
        }
      `}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="mb-10 hidden lg:block">
            <Link href="/" className="cursor-pointer">
              <ByreixLogo className="h-7" />
            </Link>
          </div>

          <nav className="space-y-1.5 overflow-y-auto custom-scrollbar">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/cms" ? pathname === "/cms" : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-4 border-t border-border lg:pt-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-black w-full h-10 px-4 py-2 rounded-xl font-bold transition-transform active:scale-95"
            >
              Exit Portal
            </Link>
          </div>
        </div>
      </aside>

      {/* BACKDROP */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 z-50 lg:hidden animate-in fade-in duration-300"
        />
      )}
    </>
  );
};
