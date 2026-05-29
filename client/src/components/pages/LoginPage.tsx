"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui";
import { Shield, Wallet } from "lucide-react";
import { motion } from "motion/react";
import { WalletLoginButton } from "../WalletLoginButton";

interface LoginPageProps {
  onWalletConnect: () => void;
  onNavigate: (page: string) => void;
  onGoogleLogin?: () => void;
  isLoading?: boolean;
}

type Feature = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

export function LoginPage({ onWalletConnect, onNavigate, isLoading = false }: LoginPageProps) {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const features: Feature[] = [
    {
      icon: Wallet,
      title: "Wallet access",
      description: "Use Sidra Wallet when you are ready to transact.",
    },
    {
      icon: Shield,
      title: "Protected entry",
      description: "Review terms before opening the app experience.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col pt-20 sm:pt-24 md:pt-28 lg:flex-row lg:pt-24">
      {/* Left Side - Login Form (Mobile First) */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md sm:max-w-lg"
        >
          {/* Login Card */}
          <Card className="gap-0 overflow-hidden border-white/14 bg-card/92 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl">
            <div className="h-px w-full bg-linear-to-r from-transparent via-primary/22 to-transparent" />
            <CardHeader className="pb-4 sm:pb-5">
              <CardTitle className="text-3xl tracking-[-0.02em] sm:text-[2.15rem]">
                Sign In
              </CardTitle>
              <CardDescription className="max-w-sm pt-0.5 text-sm text-muted-foreground/88 sm:text-[0.98rem]">
                Continue with your Sidra Wallet.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-7 pb-6 sm:pt-8 sm:pb-7">
              <div className="-mx-6 mb-5 sm:mb-6">
                <div className="h-4 border-t border-white/10 bg-linear-to-b from-white/[0.03] to-transparent sm:h-5" />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <WalletLoginButton
                  onConnect={() => onWalletConnect()}
                  disabled={isLoading || !hasAcceptedTerms}
                />

                <div className="rounded-lg border border-white/8 bg-white/[0.02] px-4 py-3.5">
                  <label className="flex items-start gap-3 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={hasAcceptedTerms}
                      onChange={(e) => setHasAcceptedTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-border bg-card text-primary focus:ring-primary/50 focus:ring-2"
                    />
                    <span className="leading-relaxed">
                      I agree to the{" "}
                      <button
                        type="button"
                        onClick={() => onNavigate("/terms")}
                        className="font-medium text-foreground transition-colors hover:text-primary"
                      >
                        Terms
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        onClick={() => onNavigate("/privacy")}
                        className="font-medium text-foreground transition-colors hover:text-primary"
                      >
                        Privacy Policy
                      </button>
                      .
                    </span>
                  </label>
                </div>
              </motion.div>
            </CardContent>
          </Card>

          {/* Contact path */}
          <p className="mt-6 text-center text-sm text-muted-foreground/90 sm:mt-7">
            Trouble signing in?{" "}
            <button
              onClick={() => onNavigate("/contact")}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Contact support
            </button>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Branding (Desktop Only) */}
      <div className="relative hidden flex-1 bg-background lg:flex">
        {/* Content */}
        <div className="flex max-w-2xl flex-col justify-center px-10 xl:px-20">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="mb-5 text-[2.7rem] font-bold leading-[1.05] xl:text-[4.3rem]">
              <span className="text-foreground">Sign in to</span>
              <br />
              <span className="text-primary">continue.</span>
            </h2>

            {/* Description */}
            <p className="mb-10 max-w-xl text-base leading-relaxed text-muted-foreground xl:text-lg">
              Continue with your Sidra Wallet.
            </p>

            {/* Features List */}
            <div className="space-y-4.5">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <feature.icon className="mt-1 h-[1.05rem] w-[1.05rem] shrink-0 text-primary/88" />
                  <div>
                    <h4 className="mb-1 text-base font-semibold text-foreground">
                      {feature.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>


          </motion.div>
        </div>
      </div>
    </div>
  );
}
