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
    icon: any;
    title: string;
    description: string;
};

export function LoginPage({
    onEmailLogin,
    onGoogleLogin,
    onWalletConnect,
    onNavigate,
    isLoading = false
}: LoginPageProps) {
    const [activeTab, setActiveTab] = useState<"email" | "social">("email");


    const features: Feature[] = [
        {
            icon: Shield,
            title: "Bank-Grade Security",
            description: "Multi-factor authentication and end-to-end encryption",
        },
        {
            icon: Lock,
            title: "Self-Custody",
            description: "You control your private keys. Always.",
        },
        {
            icon: Wallet,
            title: "Multi-Chain Support",
            description: "Access all your assets in one secure place",
        }
    ];

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Side - Login Form (Mobile First) */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-0 relative">
                {/* Subtle background glow for mobile */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                        style={{
                            background: "radial-gradient(circle, rgba(38,213,120,0.08) 0%, transparent 50%)",
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
                    <Card className="border-[#1E1E1E] bg-[#0A0A0A]/50 backdrop-blur-sm">
                        <CardHeader className="border-b border-[#1E1E1E] pb-8">
                            <CardTitle className="text-3xl">Sign In</CardTitle>
                            <CardDescription className="text-base">
                               Select a preferred sign-in method
                            </CardDescription>

                            {/* Tab Switcher with Sliding Indicator */}
                            <div className="relative flex gap-2 mt-2 p-1 bg-[#121212] rounded-lg">
                                {/* Sliding Background Indicator */}
                                <motion.div
                                    className="absolute top-1 bottom-1 w-[calc(50%-0.375rem)] bg-[#26D578] rounded-md"
                                    initial={false}
                                    animate={{
                                        x: activeTab === "email" ? 0 : "calc(100% + 0.5rem)",
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                    style={{ left: "0.25rem" }}
                                />

                                {/* Tab Buttons */}
                                <button
                                    onClick={() => setActiveTab("email")}
                                     aria-label="Sign in using email and password"
                                    className={`relative z-10 flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === "email"
                                        ? "text-black"
                                        : "text-[#A0A0A0] hover:text-white"
                                        }`}
                                >
                                    Email and Password
                                </button>
                                <button
                                    onClick={() => setActiveTab("social")}
                                    className={`relative z-10 flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === "social"
                                        ? "text-black"
                                        : "text-[#A0A0A0] hover:text-white"
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
                                            className="w-full border-[#1E1E1E] bg-[#121212] hover:bg-[#1E1E1E] hover:border-[#707070] text-white font-semibold py-7 text-base transition-all group"
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
                                                <div className="w-full border-t border-[#1E1E1E]" />
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="px-4 bg-[#0A0A0A] text-[#707070]">
                                                    or
                                                </span>
                                            </div>
                                        </div>

                                        <WalletLoginButton onConnect={() => onWalletConnect()} />

                                        {/* Security Note */}
                                        <div className=" p-5 rounded-lg bg-[#121212] border border-[#1E1E1E]">
                                            <div className="flex gap-4">
                                                <Shield className="w-6 h-6 text-[#26D578] flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-base text-[#E5E5E5] font-medium mb-1.5">
                                                        Secure and Private
                                                    </p>
                                                    <p className="text-sm text-[#707070] leading-relaxed">
                                                      We do not store passwords. Private keys remain under your control.
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
                    <p className="mt-6 text-center text-sm text-[#A0A0A0]">
                        Don&apos;t have an account?{" "}
                        <button
                            onClick={() => onNavigate("signup")}
                            className="text-[#26D578] hover:text-[#26D578]/80 font-medium transition-colors"
                        >
                            Sign up
                        </button>
                    </p>
                </motion.div>
            </div>

            {/* Right Side - Branding (Desktop Only) */}
            <div className="hidden lg:flex flex-1 bg-[#0A0A0A] relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Large ambient glow */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
                        style={{
                            background: "radial-gradient(circle, rgba(38,213,120,0.15) 0%, rgba(38,213,120,0.05) 40%, transparent 70%)",
                            filter: "blur(100px)",
                        }}
                    />

                    {/* Accent glow */}
                    <div
                        className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full"
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
                        <h2 className="text-5xl xl:text-6xl font-bold mb-6 leading-[1.1]">
                            <span className="text-white">Your wallet.</span>
                            <br />
                            <span className="bg-gradient-to-r from-[#26D578] via-[#26D578] to-[#D4AF37] bg-clip-text text-transparent">
                                Your terms.
                            </span>
                        </h2>

                        {/* Description */}
                        <p className="text-xl text-[#A0A0A0] mb-12 leading-relaxed">
                            A wallet designed for the Sidrachain ecosystem that provides full user control.
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
                                    <div className="w-12 h-12 rounded-xl bg-[#121212] border border-[#1E1E1E] flex items-center justify-center flex-shrink-0 group-hover:border-[#26D578]/50 group-hover:bg-[#26D578]/5 transition-all duration-300">
                                        <feature.icon className="w-6 h-6 text-[#26D578]" />
                                    </div>
                                    <div className="pt-1">
                                        <h4 className="text-lg font-semibold text-white mb-1">
                                            {feature.title}
                                        </h4>
                                        <p className="text-[#A0A0A0] text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-12 pt-8 border-t border-[#1E1E1E]">
                            <div className="flex items-center gap-8">
                                <div>
                                    <p className="text-3xl font-bold text-[#26D578]">Secure</p>
                                    <p className="text-sm text-[#707070]">Encryption</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-[#26D578]">100%</p>
                                    <p className="text-sm text-[#707070]">Self-Custody</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-[#26D578]">24/7</p>
                                    <p className="text-sm text-[#707070]">Support</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}