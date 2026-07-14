"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { LoginPage } from "@/components/pages";
import { PublicSiteShell } from "@/components/public/PublicSiteShell";
import { useAuthStore } from "@/store";
import { useAccount, useSignMessage, useDisconnect } from "wagmi";
import { SiweMessage } from "siwe";
import { api } from "@/lib/api";

export function LoginRouteClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();

  const hasAttemptedRef = useRef(false);

  useEffect(() => {
    if (!isConnected) {
      hasAttemptedRef.current = false;
    }
  }, [isConnected]);

  const nextPath = useMemo(() => {
    const requestedPath = searchParams.get("next");
    if (requestedPath && requestedPath.startsWith("/")) {
      return requestedPath;
    }
    return "/app";
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(nextPath);
    }
  }, [isAuthenticated, nextPath, router]);

  const handleWalletConnect = useCallback(async () => {
    if (!isConnected || !address || isAuthenticated || isLoading || hasAttemptedRef.current) {
      return;
    }

    hasAttemptedRef.current = true;
    setIsLoading(true);
    try {
      // 1. Get Nonce
      const {
        data: { nonce },
      } = await api.get("/auth/nonce");

      // 2. Create SIWE Message
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to ByReiXwift.",
        uri: window.location.origin,
        version: "1",
        chainId: 1, // Change as needed for Sidrachain
        nonce,
      });

      const preparedMessage = message.prepareMessage();

      // 3. Sign Message
      const signature = await signMessageAsync({ message: preparedMessage });

      // 4. Verify on Backend
      const { data } = await api.post("/auth/verify", {
        message: preparedMessage,
        signature,
      });

      // 5. Update Store
      login(data.user.address, data.accessToken, data.user.kycStatus, data.user.kycTier);
      toast.success("Connected.");
      router.push(nextPath);
    } catch (error) {
      console.error("SIWE error:", error);
      toast.error("Authentication failed. Please try again.");
      disconnect();
    } finally {
      setIsLoading(false);
    }
  }, [
    isConnected,
    address,
    isAuthenticated,
    isLoading,
    login,
    nextPath,
    router,
    signMessageAsync,
    disconnect,
  ]);

  // Trigger SIWE once wallet is connected
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isConnected && !isAuthenticated && !isLoading) {
      // Defer to avoid "setState synchronously within an effect" warning
      timeoutId = setTimeout(() => {
        handleWalletConnect();
      }, 0);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isConnected, isAuthenticated, isLoading, handleWalletConnect]);

  return (
    <PublicSiteShell currentPage="login">
      <LoginPage
        isLoading={isLoading}
        onNavigate={(page) => {
          if (page === "home" || page === "/") {
            router.push("/");
            return;
          }
          if (page === "signup") {
            router.push("/contact");
            return;
          }
          if (page.startsWith("/")) {
            router.push(page);
            return;
          }
          router.push("/");
        }}
        onWalletConnect={() => {
          // Connection is handled by wagmi inside the LoginPage's WalletLoginButton
        }}
        onGoogleLogin={() => {
          toast.info("Google login coming soon!");
        }}
      />
    </PublicSiteShell>
  );
}
