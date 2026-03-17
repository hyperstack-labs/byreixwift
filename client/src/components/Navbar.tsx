"use client";

import { ByreixLogo } from "./ByreixLogo";
import { Button } from "./ui";
import { Wallet, Menu, X, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
  isConnected?: boolean;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export function Navbar({
  onConnect,
  onDisconnect,
  isConnected,
  currentPage,
  onNavigate,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const lastScrolledRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const next = window.scrollY > 20;
      if (lastScrolledRef.current !== next) {
        lastScrolledRef.current = next;
        setScrolled(next);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
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

  const navLinks = isConnected
    ? [
        { label: "Wallet", value: "wallet", isGated: true },
        { label: "Escrow", value: "escrow", isGated: true },
      ]
    : [];

  const handleNavClick = (link: { label: string; value: string; isGated: boolean }) => {
    if (link.isGated && !isConnected) {
      onConnect?.();
    } else {
      onNavigate?.(link.value);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center items-start pt-6 px-4 pointer-events-none">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          ease: [0.23, 1, 0.32, 1],
        }}
        className={`pointer-events-auto w-full max-w-7xl border rounded-4xl md:rounded-[3rem] overflow-visible transition-[background-color,border-color,box-shadow] duration-300 ${
          scrolled
            ? "bg-[rgba(7,29,19,0.92)] border-[rgba(214,196,133,0.2)] shadow-[0_10px_26px_rgba(3,13,8,0.34)]"
            : "bg-transparent border-transparent shadow-none"
        }`}
      >
        <div className="px-6 md:px-12 h-16 md:h-20 flex items-center justify-between relative">
          {/* Brand/Logo */}
          <button
            onClick={() => onNavigate?.("home")}
            className="relative z-10 shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-500 outline-none rounded-lg"
            title="home"
          >
            <ByreixLogo />
          </button>

          {/* Desktop Navigation - Liquid Pill Indicator */}
          {navLinks.length > 0 && (
            <div className="hidden md:flex items-center gap-1 relative">
              {navLinks.map((link) => {
                const isActive = currentPage === link.value;
                return (
                  <button
                    key={link.value}
                    onClick={() => handleNavClick(link)}
                    className={`relative px-6 py-2.5 text-sm font-bold tracking-tight transition-colors duration-500 cursor-pointer z-10 outline-none rounded-full
                      ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/85"}`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 -z-10 rounded-full bg-primary/16" />
                    )}
                    <span className="relative z-20">{link.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Action Area - Unified Auth Group */}
          <div className="hidden md:flex items-center gap-8">
            {!isConnected && (
              <button
                onClick={() => onNavigate?.("login")}
                className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors duration-500 cursor-pointer whitespace-nowrap outline-none"
              >
                Sign In
              </button>
            )}

            {isConnected ? (
              <div className="relative" ref={menuRef}>
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center gap-2 transition-all duration-500 cursor-pointer group outline-none px-2 py-1 rounded-full hover:bg-white/5 border border-transparent active:scale-95"
                >
                  <div className="flex flex-col items-end pl-3">
                    <span className="text-[10px] uppercase tracking-widest text-(--byreix-gold-soft) font-bold">
                      Connected
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-mono text-foreground/90">0x742d...9aB8</span>
                      <ChevronDown
                        className={`w-3 h-3 text-muted-foreground transition-transform duration-300 ${showAccountMenu ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>
                </motion.button>

                {/* Account Dropdown */}
                <AnimatePresence>
                  {showAccountMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute right-0 mt-3 w-64 bg-card/95 border border-border rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-50"
                    >
                      <div className="p-2 flex flex-col gap-1">
                        <button
                          onClick={() => {
                            onNavigate?.("profile");
                            setShowAccountMenu(false);
                          }}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-all duration-500 group"
                        >
                          <User className="w-4 h-4 group-hover:text-primary transition-colors" />
                          <span className="text-sm font-semibold">View Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            onNavigate?.("cms");
                            setShowAccountMenu(false);
                          }}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-all duration-500 group"
                        >
                          <Settings className="w-4 h-4 group-hover:text-primary transition-colors" />
                          <span className="text-sm font-semibold">CMS Dashboard</span>
                        </button>
                        <div className="h-px bg-border my-1 mx-2" />
                        <button
                          onClick={() => {
                            onDisconnect?.();
                            setShowAccountMenu(false);
                          }}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all duration-500 group"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm font-bold">Disconnect</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button
                onClick={onConnect}
                className="group relative overflow-hidden bg-linear-to-br from-(--byreix-gold) to-(--byreix-gold-soft) hover:from-(--byreix-gold-soft) hover:to-(--byreix-gold) text-black font-extrabold rounded-full px-8 py-3 cursor-pointer border-none shadow-[0_0_20px_rgba(212,175,55,0.32)] transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.48)] active:scale-95 outline-none"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <span className="relative flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Connect Wallet
                </span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative z-10 p-2 text-muted-foreground hover:text-foreground transition-colors duration-500"
            title="menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu - Staggered Animations */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="md:hidden border-t border-border bg-background/70 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-3">
                {navLinks.map((link, i) => (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                    key={link.value}
                  >
                    <button
                      onClick={() => {
                        handleNavClick(link);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left py-4 px-5 rounded-2xl transition-all duration-500 text-sm font-semibold
                        ${currentPage === link.value ? "bg-primary/15 text-primary border border-primary/25" : "hover:bg-primary/10 text-muted-foreground hover:text-foreground"}`}
                    >
                      {link.label}
                    </button>
                  </motion.div>
                ))}

                <div className="h-px bg-border my-2" />

                {!isConnected ? (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col gap-3"
                  >
                    <button
                      onClick={() => {
                        onNavigate?.("login");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-4 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors duration-500"
                    >
                      Sign In
                    </button>
                    <Button
                      onClick={() => {
                        onConnect?.();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-primary text-primary-foreground font-extrabold rounded-2xl h-14 shadow-[0_0_20px_rgba(42,212,138,0.24)]"
                    >
                      <Wallet className="w-5 h-5 mr-3" />
                      Connect Wallet
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col gap-3"
                  >
                    <div className="p-4 rounded-2xl bg-card/70 border border-border flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-(--byreix-green-deep) border border-border" />
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-primary">
                            Connected
                          </span>
                          <span className="text-xs font-mono text-foreground/90">
                            0x742d...9aB8
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => {
                          onNavigate?.("profile");
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-card/60 text-muted-foreground hover:text-foreground transition-all duration-500"
                      >
                        <User className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold">View Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          onNavigate?.("cms");
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-card/60 text-muted-foreground hover:text-foreground transition-all duration-500"
                      >
                        <Settings className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold">CMS Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          onDisconnect?.();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-500/10 text-red-400 hover:text-red-300 transition-all duration-500 mt-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-bold">Disconnect</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
}
