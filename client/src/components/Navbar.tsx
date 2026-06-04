"use client";

import Link from "next/link";
import { ByreixLogo } from "./ByreixLogo";
import { Wallet, Menu, X, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  PUBLIC_HOME_NAV_LINKS,
  HOME_SECTION_IDS,
  type HomeSectionId,
} from "@/constants/homeSections";
import { PUBLIC_SITE_PAGES } from "@/constants/publicSite";

interface NavbarProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
  isConnected?: boolean;
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onSectionNavigate?: (sectionId: HomeSectionId) => void;
  ctaLabel?: string;
  connectedLabel?: string;
}

export function Navbar({
  onConnect,
  onDisconnect,
  isConnected,
  currentPage,
  onNavigate,
  onSectionNavigate,
  ctaLabel = "Connect Wallet",
  connectedLabel = "0x742d...9aB8",
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 18);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
    };
    if (showAccountMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAccountMenu]);

  // send, swap, trends routes are currently hidden
  const navLinks = isConnected
    ? [
        { label: "Wallet", value: "wallet", isGated: true },
        { label: "Escrow", value: "escrow", isGated: true },
      ]
    : [];

  const isPublicRoute = [
    "home",
    "about",
    "team",
    "principles",
    "contact",
    "login",
    "privacy",
    "terms",
  ].includes(currentPage ?? "");
  const isHomeRoute = currentPage === "home";
  const publicHomeLinks = !isConnected && isHomeRoute ? PUBLIC_HOME_NAV_LINKS : [];
  const publicPageLinks =
    !isConnected && isPublicRoute
      ? isHomeRoute
        ? PUBLIC_SITE_PAGES.filter((link) => link.value !== "principles")
        : PUBLIC_SITE_PAGES
      : [];
  const hasDesktopNav =
    navLinks.length > 0 || publicHomeLinks.length > 0 || publicPageLinks.length > 0;

  const handleNavClick = (link: { label: string; value: string; isGated: boolean }) => {
    if (link.isGated && !isConnected) {
      onConnect?.();
    } else {
      onNavigate?.(link.value);
    }
  };

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 border-b px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? "h-14 bg-black/60 backdrop-blur-md border-white/5"
          : "h-20 bg-transparent border-transparent"
      }`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
        <div className="grid h-full w-full grid-cols-[auto_1fr_auto] items-center gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-5">
          {/* Brand/Logo */}
          <div className="flex items-center justify-start">
            <button
              onClick={() => {
                if (currentPage === "home") {
                  onSectionNavigate?.(HOME_SECTION_IDS.hero);
                  return;
                }
                if (isPublicRoute) {
                  onNavigate?.("/");
                  return;
                }
                onNavigate?.("home");
              }}
              className="relative shrink-0 cursor-pointer outline-none transition-all duration-200 hover:opacity-90 active:scale-95"
              title="home"
            >
              <ByreixLogo variant="compact" />
            </button>
          </div>

          {/* Desktop Navigation */}
          {hasDesktopNav && (
            <div className="hidden min-w-0 items-center justify-center justify-self-center md:flex gap-4 lg:gap-6">
              {navLinks.map((link) => {
                const isActive = currentPage === link.value;
                return (
                  <button
                    key={link.value}
                    onClick={() => handleNavClick(link)}
                    className={`cursor-pointer whitespace-nowrap px-3 py-1.5 text-[0.88rem] font-medium tracking-tight transition-colors duration-300 outline-none ${
                      isActive ? "text-white" : "text-neutral-300 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
              {publicHomeLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onSectionNavigate?.(link.id)}
                  className="cursor-pointer whitespace-nowrap px-3 py-1.5 text-[0.88rem] font-medium tracking-tight text-neutral-300 hover:text-white transition-colors duration-300 outline-none"
                >
                  {link.label}
                </button>
              ))}
              {publicPageLinks.map((link) => {
                const isActive = currentPage === link.value;
                return (
                  <Link
                    key={link.value}
                    href={link.href}
                    className={`whitespace-nowrap px-3 py-1.5 text-[0.88rem] font-medium tracking-tight transition-colors duration-300 outline-none ${
                      isActive ? "text-white" : "text-neutral-300 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Action Area */}
          <div className="flex items-center justify-end">
            <div className="hidden items-center md:flex gap-4">
              {!isConnected && currentPage !== "login" && currentPage !== "home" && (
                <button
                  onClick={() => onNavigate?.("login")}
                  className="cursor-pointer whitespace-nowrap px-3 py-1.5 text-[0.88rem] font-medium tracking-tight text-neutral-400 hover:text-neutral-200 transition-colors duration-200 outline-none"
                >
                  Sign In
                </button>
              )}

              {isConnected ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowAccountMenu(!showAccountMenu)}
                    className="flex items-center gap-2 text-xs text-neutral-300 font-mono bg-white/5 hover:bg-white/8 border border-white/10 px-3 py-1.5 rounded-md transition duration-200 cursor-pointer outline-none"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                    <span>{connectedLabel}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${
                        showAccountMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Account Dropdown */}
                  <AnimatePresence>
                    {showAccountMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute right-0 mt-2 w-56 bg-neutral-950 border border-neutral-900 rounded-xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.5)] z-50 p-1.5 flex flex-col gap-0.5"
                      >
                        <button
                          onClick={() => {
                            onNavigate?.("profile");
                            setShowAccountMenu(false);
                          }}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white text-left transition-colors duration-150 cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">View Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            onNavigate?.("cms");
                            setShowAccountMenu(false);
                          }}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white text-left transition-colors duration-150 cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">CMS Dashboard</span>
                        </button>
                        <div className="h-px bg-white/5 my-1" />
                        <button
                          onClick={() => {
                            onDisconnect?.();
                            setShowAccountMenu(false);
                          }}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 text-left transition-colors duration-150 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">Disconnect</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={onConnect}
                  className={`h-9 rounded-full px-4 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97] ${
                    currentPage === "home" && !scrolled
                      ? "border border-white/15 bg-white/4 text-neutral-200 hover:bg-white/10 hover:text-white hover:border-white/30"
                      : "bg-white text-black hover:bg-neutral-200"
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>{ctaLabel}</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-auto p-1.5 text-neutral-400 transition-colors duration-200 hover:text-white md:hidden cursor-pointer"
              title="menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="absolute left-0 right-0 top-14 overflow-hidden border-b border-white/5 bg-black/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <button
                  key={link.value}
                  onClick={() => {
                    handleNavClick(link);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full py-2.5 text-left text-sm font-medium transition-colors ${
                    currentPage === link.value ? "text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </button>
              ))}

              {publicHomeLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onSectionNavigate?.(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-left text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                >
                  {link.label}
                </button>
              ))}

              {publicPageLinks.map((link) => (
                <Link
                  key={link.value}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block w-full py-2.5 text-left text-sm font-medium transition-colors ${
                    currentPage === link.value ? "text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="h-px bg-white/5 my-2" />

              {!isConnected ? (
                <div className="flex flex-col gap-2.5">
                  {currentPage !== "login" && currentPage !== "home" && (
                    <button
                      onClick={() => {
                        onNavigate?.("login");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2 text-left text-sm font-medium text-neutral-400 hover:text-white"
                    >
                      Sign In
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onConnect?.();
                      setMobileMenuOpen(false);
                    }}
                    className="h-10 w-full rounded-full bg-white text-xs font-semibold text-black flex items-center justify-center gap-2 transition duration-200 active:scale-95"
                  >
                    <Wallet className="w-4 h-4" />
                    {ctaLabel}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-xs text-neutral-300 font-mono bg-white/5 border border-white/10 px-3 py-2 rounded-lg">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                    <span>{connectedLabel}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-1">
                    <button
                      onClick={() => {
                        onNavigate?.("profile");
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2.5 py-2.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">View Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigate?.("cms");
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2.5 py-2.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm font-medium">CMS Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        onDisconnect?.();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2.5 py-2.5 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Disconnect</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
