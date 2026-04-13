import Image from "next/image";

interface ByreixLogoProps {
  className?: string;
  variant?: "default" | "compact";
}

export function ByreixLogo({ className = "", variant = "default" }: ByreixLogoProps) {
  const isCompact = variant === "compact";

  return (
    <div className={`flex items-center ${isCompact ? "gap-1" : "gap-1.5"} ${className}`}>
      {/* Logo Icon */}
      <Image
        src="/logo_transparent.png"
        alt="ByReiXwift"
        width={isCompact ? 31 : 40}
        height={isCompact ? 31 : 40}
        className={isCompact ? "h-[1.9rem] w-auto sm:h-[1.98rem]" : "h-[2.35rem] w-auto"}
      />

      {/* Wordmark - Gradient text */}
      <span
        className={`bg-linear-to-r from-(--byreix-gold-soft) via-(--byreix-gold) to-[#ead39e] bg-clip-text font-semibold tracking-[-0.035em] text-transparent ${
          isCompact ? "text-[1.24rem] sm:text-[1.32rem]" : "text-[1.54rem] sm:text-[1.66rem]"
        }`}
        style={{ fontFamily: "var(--font-heading)" }}
      >
        ByReiXwift
      </span>
    </div>
  );
}
