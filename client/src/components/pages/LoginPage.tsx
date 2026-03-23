"use client";

import { useState } from "react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui";
import { Wallet, Shield, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LoginForm } from "../LoginForm";
import { WalletLoginButton } from "../WalletLoginButton";

interface LoginPageProps {
  onEmailLogin: (credentials: { email: string; password: string; rememberMe: boolean }) => void;
  onGoogleLogin: () => void;
  onWalletConnect: () => void;
  onNavigate: (page: string) => void;
  isLoading?: boolean;
}

type Feature = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

export function LoginPage({
  onEmailLogin,
  onGoogleLogin,
  onWalletConnect,
  onNavigate,
  isLoading = false,
}: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<"email" | "social">("email");

  const features: Feature[] = [
    {
      icon: Shield,
      title: "Clear access",
      description: "Choose the sign-in method that fits how you use the platform.",
    },
    {
      icon: Lock,
      title: "Wallet stays with you",
      description:
        "Wallet actions stay under your control instead of being hidden behind custodial language.",
    },
    {
      icon: Wallet,
      title: "Straight into the app",
      description: "Sign in and move directly into payments, transfers, or escrow workflows.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col pt-20 sm:pt-24 md:pt-28 lg:flex-row lg:pt-24">
      {/* Left Side - Login Form (Mobile First) */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-0">
        {/* Subtle background glow for mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(6,95,70,0.08) 0%, transparent 50%)",
              filter: "blur(80px)",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md sm:max-w-lg"
        >
          {/* Login Card */}
          <Card className="border-border bg-background/78">
            <CardHeader className="border-b border-border pb-6 sm:pb-7">
              <CardTitle className="text-2xl sm:text-3xl">Sign In</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Choose a sign-in method to open the app
              </CardDescription>

              {/* Tab Switcher with Sliding Indicator */}
              <div className="relative mt-2 flex gap-2 rounded-lg bg-card p-1">
                {/* Sliding Background Indicator */}
                <motion.div
                  className="absolute top-1 bottom-1 w-[calc(50%-0.375rem)] bg-primary rounded-md"
                  initial={false}
                  animate={{
                    x: activeTab === "email" ? 0 : "calc(100% + 0.5rem)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 42,
                  }}
                  style={{ left: "0.25rem" }}
                />

                {/* Tab Buttons */}
                <button
                  onClick={() => setActiveTab("email")}
                  aria-label="Sign in using email and password"
                  className={`relative z-10 flex-1 rounded-md px-2 py-3 text-[0.82rem] font-medium leading-tight transition-colors sm:text-sm ${
                    activeTab === "email"
                      ? "text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Email and Password
                </button>
                <button
                  onClick={() => setActiveTab("social")}
                  className={`relative z-10 flex-1 rounded-md px-2 py-3 text-[0.82rem] font-medium leading-tight transition-colors sm:text-sm ${
                    activeTab === "social"
                      ? "text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Social / Wallet
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-5 pb-5">
              <AnimatePresence mode="wait">
                {activeTab === "email" ? (
                  /* Email/Password Login Form */
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LoginForm
                      onSubmit={onEmailLogin}
                      onNavigate={onNavigate}
                      isLoading={isLoading}
                    />
                  </motion.div>
                ) : (
                  /* Social/Wallet Login Options */
                  <motion.div
                    key="social"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    {/* Google Sign In Button */}
                    <Button
                      aria-label="Continue with Google preview"
                      disabled={isLoading}
                      onClick={onGoogleLogin}
                      variant="outline"
                      className="group h-11 w-full border-border bg-card transition-all hover:bg-border sm:h-12"
                    >
                      <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google Preview
                    </Button>

                    {/* Divider */}
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-background text-muted-foreground">or</span>
                      </div>
                    </div>

                    <WalletLoginButton onConnect={() => onWalletConnect()} />

                    {/* Access note */}
                    <div className="rounded-xl border border-border bg-card/72 p-4 sm:p-5">
                      <div className="flex gap-4">
                        <Shield className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-base text-foreground font-medium mb-1.5">
                            Private by design
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Wallet actions stay under your control. The current sign-in routes open
                            a preview app session while the production auth flow is still being
                            integrated.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Contact path */}
          <p className="mt-5 text-center text-sm text-muted-foreground sm:mt-6">
            Need access or have questions?{" "}
            <button
              onClick={() => onNavigate("signup")}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Contact the team
            </button>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Branding (Desktop Only) */}
      <div className="relative hidden flex-1 overflow-hidden bg-background lg:flex">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large ambient glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(6,95,70,0.15) 0%, rgba(6,95,70,0.05) 40%, transparent 70%)",
              filter: "blur(100px)",
            }}
          />

          {/* Accent glow */}
          <div
            className="absolute top-1/4 right-0 w-125 h-125 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(212,175,55,0.10) 0%, transparent 60%)",
              filter: "blur(80px)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex max-w-2xl flex-col justify-center px-10 xl:px-20">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Headline */}
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
              Access ByReiXwift
            </p>
            <h2 className="mb-5 text-[2.7rem] font-bold leading-[1.05] xl:text-[4.3rem]">
              <span className="text-foreground">Sign in and continue</span>
              <br />
              <span className="text-primary">with the app.</span>
            </h2>

            {/* Description */}
            <p className="mb-10 max-w-xl text-base leading-relaxed text-muted-foreground xl:text-lg">
              Use the method that fits your workflow and move into payments, transfers, or escrow.
            </p>

            {/* Features List */}
            <div className="space-y-5">
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

            {/* Access indicators */}
            <div className="mt-10 border-t border-border pt-6">
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Access", value: "Direct to app" },
                  { label: "Wallet", value: "Ready when needed" },
                  { label: "Review", value: "Clear before action" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-full border border-white/8 bg-card/60 px-3.5 py-2"
                  >
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-foreground/44">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground/86">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
