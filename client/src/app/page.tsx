"use client";

import { useState } from "react";
import { Navbar, Footer, AnnouncementBanner, AdContainer } from "@/components";
import { LandingPage, LoginPage, WalletDashboard, EscrowPage } from "@/components/pages";
import { Toaster } from "@/components/ui/sonner"; // Keep specific if sonner has default/named mix not in ui/index? ui/index exports sonner. sonner usually exports Toaster named.
import { toast } from "sonner";
import { useAuthStore } from "@/store";

import { TokenPriceBoard } from "@/components/TokenPriceBoard.example";
export default function Home() {
  // Page navigation
  const [currentPage, setCurrentPage] = useState("home");

  // Wallet & authentication states
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { isAuthenticated, login } = useAuthStore();


  // Navigation handler
  const handleNavigate = (page: string) => {
    if ((page === "wallet" || page === "escrow") && !isAuthenticated) {
      toast.error("Please log in to access this page.");
      return;
    }

    setCurrentPage(page);
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  // Wallet connect handler with login check
  const handleConnect = () => {
    if (!isAuthenticated) {
      toast.error("Please login first!");
      setCurrentPage("login");
      return;
    }

    if (!isWalletConnected) {
      setTimeout(() => {
        setIsWalletConnected(true);
        toast.success("Wallet connected successfully!");
        setCurrentPage("wallet");
      }, 500);
    }
  };

  // Email login handler
  const handleEmailLogin = (credentials: { email: string; password: string; rememberMe: boolean }) => {
    setTimeout(() => {
      // mark user as logged in
      login(credentials.email);
      setIsWalletConnected(true);
      toast.success(`Welcome back! Signed in as ${credentials.email}`);
      setCurrentPage("wallet");
    }, 1000);
  };

  // Google login handler
  const handleGoogleLogin = () => {
    setTimeout(() => {
      setIsWalletConnected(true);
      login("user@google.com");
      toast.success("Signed in with Google successfully!");
      setCurrentPage("wallet");
    }, 1000);
  };

  // Reuse wallet connect
  const handleWalletConnect = () => {
    handleConnect();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-['Inter']">
      {/* Navbar */}
      <Navbar
        onConnect={handleConnect}
        isConnected={isWalletConnected}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      <main className="relative">
        <div className="py-4">
          <AdContainer simulateError={true} />
        </div>

        
        {/* <TokenPriceBoard /> */}

        {/* Page Rendering */}
        {currentPage === "home" && (
          <LandingPage onNavigate={handleNavigate} onConnect={handleConnect} />
        )}
        {currentPage === "login" && (
          <LoginPage
            onNavigate={handleNavigate}
            onEmailLogin={handleEmailLogin}
            onGoogleLogin={handleGoogleLogin}
            onWalletConnect={handleWalletConnect}
          />
        )}
        {currentPage === "wallet" && isAuthenticated ? (
          <WalletDashboard />
        ) : currentPage === "wallet" && !isAuthenticated ? (
          <LoginPage
            onNavigate={handleNavigate}
            onEmailLogin={handleEmailLogin}
            onGoogleLogin={handleGoogleLogin}
            onWalletConnect={handleWalletConnect}
          />
        ) : null}
        {currentPage === "escrow" && <EscrowPage />}
      </main>

      <Footer />
      <AnnouncementBanner />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#121212",
            border: "1px solid #1E1E1E",
            color: "#FFFFFF",
          },
        }}
      />
    </div>
  );
}
