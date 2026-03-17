"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "motion/react";

interface FloatingCardProps {
  className?: string;
}

export function FloatingCard({ className = "" }: FloatingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    // Throttle with requestAnimationFrame
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const maxRotate = 12;
      const rotateYValue = (mouseX / (rect.width / 2)) * maxRotate;
      const rotateXValue = -(mouseY / (rect.height / 2)) * maxRotate;

      setRotate({ x: rotateXValue, y: rotateYValue });
      rafRef.current = null;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setRotate({ x: 0, y: 0 });
  }, []);

  const tokens = [
    { symbol: "SDA", color: "#D4AF37" },
    { symbol: "ETH", color: "#627EEA" },
    { symbol: "BTC", color: "#F7931A" },
  ];

  return (
    <div className={`${className}`} style={{ perspective: "1000px" }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: rotate.x,
          rotateY: rotate.y,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Glow effect with blur */}
        <div
          className="absolute -inset-4 rounded-3xl opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(42, 212, 138, 0.32) 0%, rgba(212, 175, 55, 0.16) 52%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Main card - Obsidian Material */}
        <div className="relative bg-card border border-border shadow-2xl rounded-3xl p-6 sm:p-10 overflow-hidden">
          {/* Glassy overlay - Higher opacity for premium feel */}
          <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none" />

          {/* Animated rim glow */}
          <div className="absolute inset-0 rounded-3xl border border-primary/30" />

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Live</span>
              </div>
              <div className="text-xs text-muted-foreground">0x742d...9aB8</div>
            </div>

            {/* Balance */}
            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-bold text-foreground">$44,976</span>
                <span className="text-lg text-muted-foreground">.00</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-primary">+$2,345.50</span>
                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                  +5.5%
                </span>
              </div>
            </div>

            {/* Token icons */}
            <div className="flex items-center gap-3">
              {tokens.map((token, i) => (
                <div
                  key={token.symbol}
                  className="flex items-center gap-2 px-3 py-2 bg-background/50 rounded-xl border border-border"
                  style={{ transform: `translateZ(${20 + i * 10}px)` }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: `${token.color}20`, color: token.color }}
                  >
                    {token.symbol[0]}
                  </div>
                  <span className="text-sm text-foreground">{token.symbol}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative blur elements */}
          <div
            className="absolute top-4 right-4 w-20 h-20 rounded-full bg-primary/10"
            style={{ filter: "blur(20px)" }}
          />
          <div
            className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-(--byreix-gold)/10"
            style={{ filter: "blur(20px)" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
