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
      title: "Policy-Based Security",
      description: "Session controls, verification checks, and encrypted transport",
    },
    {
      icon: Lock,
      title: "Self-Custody",
      description: "You control your private keys. Always.",
    },
    {
      icon: Wallet,
      title: "Sidrachain Native",
      description: "Wallet workflows tuned for Sidrachain operations",
    },
  ];

  return (
    <div className="min-h-screen pt-24 md:pt-28 lg:pt-24 flex flex-col lg:flex-row">
      {/* Left Side - Login Form (Mobile First) */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-0 relative">
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
          className="w-full max-w-lg relative z-10"
        >
          {/* Login Card */}
          <Card className="border-border bg-background/70">
            <CardHeader className="border-b border-border pb-8">
              <CardTitle className="text-3xl">Sign In</CardTitle>
              <CardDescription className="text-base">
                Choose a sign-in method to continue
              </CardDescription>

              {/* Tab Switcher with Sliding Indicator */}
              <div className="relative flex gap-2 mt-2 p-1 bg-card rounded-lg">
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
                  className={`relative z-10 flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "email"
                      ? "text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Email and Password
                </button>
                <button
                  onClick={() => setActiveTab("social")}
                  className={`relative z-10 flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${
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
                      aria-label="Sign in with Google"
                      disabled={isLoading}
                      onClick={onGoogleLogin}
                      variant="outline"
                      className="w-full border-border bg-card hover:bg-border transition-all group"
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
                      Continue with Google
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

                    {/* Security Note */}
                    <div className="p-5 rounded-xl bg-card border border-border">
                      <div className="flex gap-4">
                        <Shield className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-base text-foreground font-medium mb-1.5">
                            Secure and Private
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Passwords are never persisted, and private keys remain under your
                            control.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => onNavigate("signup")}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign up
            </button>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Branding (Desktop Only) */}
      <div className="hidden lg:flex flex-1 bg-background relative overflow-hidden">
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
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Headline */}
            <p className="text-xs font-semibold tracking-[0.22em] uppercase text-primary/80 mb-6">
              Access Console
            </p>
            <h2 className="text-5xl xl:text-6xl font-bold mb-6 leading-[1.1]">
              <span className="text-foreground">Secure access,</span>
              <br />
              <span className="text-primary">operational clarity.</span>
            </h2>

            {/* Description */}
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              Designed for Sidrachain users who need clear account controls and direct custody.
            </p>

            {/* Features List */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-lg font-semibold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-3xl font-bold text-primary">Auditable</p>
                  <p className="text-sm text-muted-foreground">Session Trails</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">100%</p>
                  <p className="text-sm text-muted-foreground">Self-Custody</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">24/7</p>
                  <p className="text-sm text-muted-foreground">Availability</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
