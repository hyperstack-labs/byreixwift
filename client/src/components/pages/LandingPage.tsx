"use client";

import { Button } from "../ui";
import { ArrowRight, Repeat, Send, TrendingUp, ShieldCheck, Zap, Lock, Wallet, Users, Globe } from "lucide-react";
import { motion } from "motion/react";
import { FloatingCard } from "../FloatingCard";
import { AdSlot, BannerAd, BannerAdSize } from "../ads";

interface LandingPageProps {
    onNavigate: (page: string) => void;
    onConnect: () => void;
}

export function LandingPage({ onNavigate, onConnect }: LandingPageProps) {
    const features = [
        {
            icon: Repeat,
            title: "Swap",
            description: "Competitive rates across decentralized exchanges. Transparent fee structure.",
            gradient: "from-[#26D578]/20 to-transparent",
        },
        {
            icon: Send,
            title: "Send",
            description: "Near-real-time transfers to compatible wallets.",
            gradient: "from-[#D4AF37]/20 to-transparent",
        },
        {
            icon: TrendingUp,
            title: "TrendView",
            description: "Real-time charts and analytics.",
            gradient: "from-[#26D578]/20 to-transparent",
        },
        {
            icon: ShieldCheck,
            title: "Smart Escrow",
            description: "Secure peer-to-peer transactions using smart escrow.",
            gradient: "from-[#D4AF37]/20 to-transparent",
        },
    ];

    const benefits = [
        {
            icon: Zap,
            title: "Sub-Second Finality",
            description: "Transactions finalize within seconds.",
        },
        {
            icon: Lock,
            title: "Self-Custody",
            description: "Full control of private keys with no intermediary custody.",
        },
        {
            icon: Wallet,
            title: "Sidrachain Native",
            description: "Built specifically for the Sidra ecosystem.",
        },
    ];

    const trustBadges = [
        { icon: ShieldCheck, text: "Non-Custodial" },
        { icon: Globe, text: "Sidrachain Native" },
        { icon: Users, text: "Community Driven" },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}

            <section className="relative min-h-screen flex items-center pt-20 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background - Earth-like glow */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Large earth-like half circle glow at bottom */}
                    <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[1200px] h-[1200px] rounded-full"
                        style={{
                            background: "radial-gradient(circle, rgba(38,213,120,0.18) 0%, rgba(38,213,120,0.06) 30%, transparent 60%)",
                            filter: "blur(80px)",
                        }}
                    />

                    {/* Subtle top ambient glow */}
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
                        style={{
                            background: "radial-gradient(circle, rgba(38,213,120,0.10) 0%, transparent 50%)",
                            filter: "blur(100px)",
                        }}
                    />

                    {/* Subtle right accent */}
                    <div
                        className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full"
                        style={{
                            background: "radial-gradient(circle, rgba(38,213,120,0.08) 0%, transparent 60%)",
                            filter: "blur(80px)",
                        }}
                    />
                </div>


                <div className="max-w-7xl mx-auto relative w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left: Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121212] border border-[#1E1E1E] mb-8"
                            >
                                <div className="w-2 h-2 bg-[#26D578] rounded-full animate-pulse" />
                                <span className="text-sm text-[#A0A0A0]">
                                    Smart Escrow is live
                                </span>
                            </motion.div>

                            {/* Headline */}
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1]">
                                <span className="text-white">Your wallet.</span>
                                <br />
                                <span className="bg-gradient-to-r from-[#26D578] via-[#26D578] to-[#D4AF37] bg-clip-text text-transparent">
                                    Your terms.
                                </span>
                            </h1>

                            {/* Subheading */}
                            <p className="text-lg sm:text-xl text-[#A0A0A0] mb-8 max-w-md leading-relaxed">
                                The non-custodial wallet for Sidrachain. Swap, send, and track with zero compromise.
                            </p>

                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
                                <Button
                                    onClick={onConnect}
                                    size="lg"
                                    className="bg-[#26D578] hover:bg-[#26D578]/90 text-black font-semibold text-lg px-8 py-6 group transition-all hover:shadow-[0_0_30px_rgba(0,210,106,0.3)]"
                                >
                                    Launch App
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button
                                    onClick={() => onNavigate("wallet")}
                                    size="lg"
                                    variant="ghost"
                                    className="text-[#A0A0A0] hover:text-white text-lg px-6 py-6"
                                >
                                    View Demo
                                </Button>
                            </div>

                            {/* Trust badges */}
                            <div className="flex flex-wrap items-center gap-6">
                                {trustBadges.map((badge) => (
                                    <div key={badge.text} className="flex items-center gap-2 text-[#A0A0A0]">
                                        <badge.icon className="w-4 h-4 text-[#26D578]/60" />
                                        <span className="text-sm">{badge.text}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right: Floating Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 30, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="flex justify-center lg:justify-end"
                        >
                            <FloatingCard className="w-full max-w-md" />
                        </motion.div>
                    </div>
                </div>
            </section>
            <AdSlot adId="Hero-ads">
                <BannerAd
                    imageURL="/mockThumbnail.png"
                    linkURL="https://example.com"
                    size={BannerAdSize.LEADERBOARD} altText="Leaderboard Ad" />
            </AdSlot>

            {/* Features Grid */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                            Built for speed. Designed for you.
                        </h2>
                        <p className="text-lg text-[#A0A0A0] max-w-xl mx-auto">
                            Four core features. Zero learning curve.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="relative group"
                            >
                                <div className="h-full p-6 rounded-2xl bg-[#121212] border border-[#1E1E1E] hover:border-[#26D578]/50 transition-all duration-300 hover:-translate-y-1">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-xl bg-[#26D578]/10 flex items-center justify-center mb-4 group-hover:bg-[#26D578]/20 transition-colors">
                                            <feature.icon className="w-6 h-6 text-[#26D578]" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                        <p className="text-[#A0A0A0] text-sm">{feature.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                                Why Byreixwift?
                            </h2>
                            <p className="text-lg text-[#A0A0A0] mb-8">
                                Designed to provide a secure and efficient experience for digital asset management.
                            </p>

                            <div className="space-y-6">
                                {benefits.map((benefit, index) => (
                                    <motion.div
                                        key={benefit.title}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className="flex items-start gap-4 group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-[#26D578]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#26D578]/20 transition-colors">
                                            <benefit.icon className="w-5 h-5 text-[#26D578]" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold mb-1">{benefit.title}</h4>
                                            <p className="text-[#A0A0A0] text-sm">{benefit.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Stats grid */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {[
                                { value: "0.5s", label: "Avg. Confirmation" },
                                { value: "100%", label: "Self-Custody" },
                                { value: "$0", label: "Platform Fees" },
                                { value: "24/7", label: "Uptime" },
                            ].map((stat, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-[#121212] border border-[#1E1E1E] text-center hover:border-[#26D578]/30 transition-colors group">
                                    <p className="text-3xl font-bold text-[#26D578] mb-1 group-hover:scale-105 transition-transform">{stat.value}</p>
                                    <p className="text-sm text-[#A0A0A0]">{stat.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto text-center relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#26D578]/10 via-[#D4AF37]/10 to-[#26D578]/10 rounded-3xl blur-3xl -z-10" />
                    <div className="bg-[#121212] border border-[#1E1E1E] rounded-3xl p-12 hover:border-[#26D578]/30 transition-colors">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Get Started
                        </h2>
                        <p className="text-lg text-[#A0A0A0] mb-8">
                            No email registration or identity verification required. Connect your wallet to begin.
                        </p>
                        <Button
                            onClick={onConnect}
                            size="lg"
                            className="bg-[#26D578] hover:bg-[#26D578]/90 text-black font-semibold text-lg px-8 py-6 group transition-all hover:shadow-[0_0_30px_rgba(0,210,106,0.3)]"
                        >
                            Connect Wallet
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
