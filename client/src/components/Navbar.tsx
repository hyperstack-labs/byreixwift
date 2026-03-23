"use client";

import Link from "next/link";
import { ByreixLogo } from "./ByreixLogo";
import { Button } from "./ui";
import { Wallet, Menu, X, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
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
  const { scrollY } = useScroll();

  useEffect(() => {
    setScrolled(window.scrollY > 18);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 18);
  });

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
        { label: "Send", value: "send", isGated: true },
        { label: "Swap", value: "swap", isGated: true },
        { label: "Trends", value: "trends", isGated: true },
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
  const publicHomeLinks = !isConnected && isPublicRoute ? PUBLIC_HOME_NAV_LINKS : [];
  const publicPageLinks =
    !isConnected && isPublicRoute
      ? isHomeRoute
        ? PUBLIC_SITE_PAGES.filter((link) => link.value !== "principles")
        : PUBLIC_SITE_PAGES
      : [];
  const hasDesktopNav =
    navLinks.length > 0 || publicHomeLinks.length > 0 || publicPageLinks.length > 0;
  const useSolidChrome =
    scrolled || mobileMenuOpen || currentPage !== "home" || Boolean(isConnected);
  const useQuietHomeCta = isHomeRoute && !useSolidChrome && !isConnected;
  const desktopBarHeight = useSolidChrome ? 58 : 68;

  const handleNavClick = (link: { label: string; value: string; isGated: boolean }) => {
    if (link.isGated && !isConnected) {
      onConnect?.();
    } else {
      onNavigate?.(link.value);
    }
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-3 pt-2.5 sm:px-6 lg:px-8">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.23, 1, 0.32, 1],
        }}
        className="pointer-events-none mx-auto max-w-6xl"
      >
        <motion.div
          layout
          animate={{
            y: useSolidChrome ? -2 : 0,
            scale: useSolidChrome ? 0.992 : 1,
          }}
          transition={{
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`pointer-events-auto overflow-hidden rounded-[1.35rem] border transition-[background-color,border-color,box-shadow] duration-300 sm:rounded-[1.5rem] ${
            useSolidChrome
              ? "border-[rgba(214,196,133,0.16)] bg-[rgba(5,18,12,0.82)] backdrop-blur-xl shadow-[0_14px_34px_rgba(3,13,8,0.3)]"
              : "border-transparent bg-transparent shadow-none"
          }`}
        >
          <motion.div
            layout
            animate={{ height: desktopBarHeight }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3.5 sm:px-5 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-5 lg:px-6"
          >
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
                className="relative z-10 shrink-0 scale-[0.94] cursor-pointer rounded-lg outline-none transition-all duration-500 hover:scale-[0.985] active:scale-95 sm:scale-100 sm:hover:scale-105"
                title="home"
              >
                <ByreixLogo variant="compact" />
              </button>
            </div>

            {/* Desktop Navigation */}
            {hasDesktopNav && (
              <div className="hidden min-w-0 items-center justify-center justify-self-center md:flex">
                <motion.div
                  layout
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-6 lg:gap-8"
                >
                  {navLinks.map((link) => {
                    const isActive = currentPage === link.value;
                    return (
                      <button
                        key={link.value}
                        onClick={() => handleNavClick(link)}
                        className={`relative px-1 py-2 text-sm font-semibold tracking-[-0.01em] transition-colors duration-300 cursor-pointer whitespace-nowrap outline-none ${
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground/85"
                        }`}
                      >
                        <span>{link.label}</span>
                        <span
                          className={`absolute inset-x-0 -bottom-1.5 h-px origin-center bg-primary transition-transform duration-300 ${
                            isActive ? "scale-x-100" : "scale-x-0"
                          }`}
                        />
                      </button>
                    );
                  })}
                  {publicHomeLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => onSectionNavigate?.(link.id)}
                      className="relative px-1 py-2 text-sm font-semibold tracking-[-0.01em] text-muted-foreground transition-colors duration-300 whitespace-nowrap outline-none hover:text-foreground/85"
                    >
                      <span>{link.label}</span>
                    </button>
                  ))}
                  {publicPageLinks.map((link) => {
                    const isActive = currentPage === link.value;

                    return (
                      <Link
                        key={link.value}
                        href={link.href}
                        className={`relative px-1 py-2 text-sm font-semibold tracking-[-0.01em] transition-colors duration-300 whitespace-nowrap outline-none ${
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground/85"
                        }`}
                      >
                        <span>{link.label}</span>
                        <span
                          className={`absolute inset-x-0 -bottom-1.5 h-px origin-center bg-primary transition-transform duration-300 ${
                            isActive ? "scale-x-100" : "scale-x-0"
                          }`}
                        />
                      </Link>
                    );
                  })}
                </motion.div>
              </div>
            )}

            {/* Action Area - Unified Auth Group */}
            <div className="flex items-center justify-end">
              <div className="hidden items-center gap-4 lg:gap-6 md:flex">
                {!isConnected && currentPage !== "login" && (
                  <button
                    onClick={() => onNavigate?.("login")}
                    className={`text-sm font-semibold tracking-[-0.01em] transition-colors duration-300 cursor-pointer whitespace-nowrap outline-none ${
                      useQuietHomeCta
                        ? "text-foreground/62 hover:text-foreground/86"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
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
                      className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/4 px-3 py-2 transition-all duration-300 cursor-pointer outline-none hover:border-primary/20 hover:bg-white/6 active:scale-95"
                    >
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase tracking-widest text-(--byreix-gold-soft) font-bold">
                          Connected
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-mono text-foreground/90">
                            {connectedLabel}
                          </span>
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
                    className={`group relative h-9 rounded-lg px-4 text-[0.92rem] font-semibold transition-all duration-300 active:scale-95 sm:h-10 sm:rounded-xl sm:px-[1.125rem] sm:text-sm ${
                      useQuietHomeCta
                        ? "border border-white/10 bg-white/[0.03] text-foreground shadow-none hover:border-white/18 hover:bg-white/[0.05]"
                        : "border border-primary/25 bg-primary/92 text-primary-foreground hover:bg-primary hover:shadow-[0_10px_24px_rgba(37,201,133,0.18)]"
                    }`}
                  >
                    <span className="relative flex items-center gap-2.5">
                      <Wallet
                        className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                          useQuietHomeCta ? "text-foreground/76" : "text-primary-foreground/90"
                        }`}
                      />
                      {ctaLabel}
                    </span>
                  </Button>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative z-10 ml-auto p-1.5 text-muted-foreground transition-colors duration-300 hover:text-foreground sm:p-2 md:hidden"
                title="menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </motion.div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden border-t border-[rgba(214,196,133,0.12)] bg-[rgba(5,18,12,0.96)] backdrop-blur-xl md:hidden"
              >
                <div className="mx-auto flex max-w-6xl flex-col gap-3 px-3.5 py-4 sm:px-6 sm:py-5 lg:px-8">
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
                        className={`w-full border-b px-0 py-3.5 text-left text-sm font-semibold transition-all duration-300 ${
                          currentPage === link.value
                            ? "border-primary/35 text-foreground"
                            : "border-white/8 text-muted-foreground hover:border-primary/18 hover:text-foreground"
                        }`}
                      >
                        {link.label}
                      </button>
                    </motion.div>
                  ))}

                  {publicHomeLinks.map((link, i) => (
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                      key={link.id}
                    >
                      <button
                        onClick={() => {
                          onSectionNavigate?.(link.id);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full border-b border-white/8 px-0 py-3.5 text-left text-sm font-semibold text-muted-foreground transition-all duration-300 hover:border-primary/18 hover:text-foreground"
                      >
                        {link.label}
                      </button>
                    </motion.div>
                  ))}

                  {publicPageLinks.map((link, i) => (
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 + 0.08 }}
                      key={link.value}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block w-full border-b px-0 py-3.5 text-left text-sm font-semibold transition-all duration-300 ${
                          currentPage === link.value
                            ? "border-primary/35 text-foreground"
                            : "border-white/8 text-muted-foreground hover:border-primary/18 hover:text-foreground"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}

                  <div className="my-3 h-px bg-white/8" />

                  {!isConnected ? (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-col gap-3 pt-2"
                    >
                      {currentPage !== "login" && (
                        <button
                          onClick={() => {
                            onNavigate?.("login");
                            setMobileMenuOpen(false);
                          }}
                          className="w-full px-0 py-2.5 text-left text-sm font-semibold text-muted-foreground transition-colors duration-300 hover:text-foreground"
                        >
                          Sign In
                        </button>
                      )}
                      <Button
                        onClick={() => {
                          onConnect?.();
                          setMobileMenuOpen(false);
                        }}
                        className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_rgba(37,201,133,0.16)] sm:h-12"
                      >
                        <Wallet className="w-5 h-5 mr-3" />
                        {ctaLabel}
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-col gap-3"
                    >
                      <div className="mb-2 flex items-center justify-between rounded-2xl border border-white/10 bg-white/4 p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl border border-white/10 bg-linear-to-br from-primary to-(--byreix-green-deep)" />
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-primary">
                              Connected
                            </span>
                            <span className="text-xs font-mono text-foreground/90">
                              {connectedLabel}
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
                          className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/3 px-4 py-4 text-muted-foreground transition-all duration-300 hover:border-primary/18 hover:text-foreground"
                        >
                          <User className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold">View Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            onNavigate?.("cms");
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/3 px-4 py-4 text-muted-foreground transition-all duration-300 hover:border-primary/18 hover:text-foreground"
                        >
                          <Settings className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold">CMS Dashboard</span>
                        </button>
                        <button
                          onClick={() => {
                            onDisconnect?.();
                            setMobileMenuOpen(false);
                          }}
                          className="mt-2 flex items-center gap-3 rounded-xl border border-red-500/18 bg-red-500/10 px-4 py-4 text-red-400 transition-all duration-300 hover:text-red-300"
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
      </motion.div>
    </nav>
  );
}
