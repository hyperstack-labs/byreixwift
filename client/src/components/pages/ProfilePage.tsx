"use client";

import { motion } from "motion/react";
import { User, Shield, CreditCard, Activity, Bell, ShieldCheck, Fingerprint } from "lucide-react";
import { Button } from "../ui";
import { useAuthStore } from "@/store";
import { KycStatusBadge } from "@/components/kyc/KycStatusBadge";
import { KycVerifyButton } from "@/components/kyc/KycVerifyButton";

export function ProfilePage() {
  const identity = useAuthStore((s) => s.identity);
  const kycStatus = useAuthStore((s) => s.kycStatus);
  const kycTier = useAuthStore((s) => s.kycTier);
  const userAddress = identity || "0x0000...0000";

  return (
    <div className="min-h-screen pt-40 pb-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header Area */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary to-accent p-1">
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                    <User className="w-10 h-10 text-primary/50" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full border-4 border-background flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-background" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">My Profile</h1>
                <p className="text-sm font-mono text-muted-foreground">{userAddress}</p>
              </div>
            </div>

            <Button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl px-8 h-12 transition-all">
              Edit Preferences
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: "Total Security Cleanups", value: "142", icon: Shield },
              { label: "Active Escrows", value: "3", icon: CreditCard },
              { label: "Trust Score", value: "99.8%", icon: Activity },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-card border border-border group hover:border-primary/50 transition-colors"
              >
                <stat.icon className="w-6 h-6 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-bold">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* KYC Section */}
          <div className="mb-8">
            <div className="p-8 rounded-3xl bg-card border border-border">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Fingerprint className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Identity Verification</h3>
                    <p className="text-sm text-muted-foreground">
                      Verify your identity to unlock higher transaction limits and enhanced security.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <KycStatusBadge status={kycStatus} tier={kycTier} />
                  <KycVerifyButton />
                </div>
              </div>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white/50 px-4 mb-8">Security & Preferences</h2>

            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  title: "Notifications",
                  desc: "Manage push and email alerts for your wallet activity.",
                  icon: Bell,
                },
                {
                  title: "Privacy Mode",
                  desc: "Hide balances and sensitive info from the main dashboard.",
                  icon: Shield,
                },
                {
                  title: "Wallet Recovery",
                  desc: "Configure multi-sig and social recovery settings.",
                  icon: ShieldCheck,
                },
              ].map((item, i) => (
                <motion.button
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="w-full flex items-center justify-between p-6 rounded-3xl bg-card border border-border hover:bg-white/5 transition-all text-left group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground font-light">{item.desc}</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-primary transition-colors" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
