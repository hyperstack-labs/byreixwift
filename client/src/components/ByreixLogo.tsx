import Image from "next/image";

interface ByreixLogoProps {
  className?: string;
  variant?: "default" | "compact";
}

export function ByreixLogo({ className = "", variant = "default" }: ByreixLogoProps) {
  const isCompact = variant === "compact";

  return (
    <div className={`flex items-center ${isCompact ? "gap-1.25" : "gap-1.5"} ${className}`}>
      {/* Logo Icon */}
      <Image
        src="/logo_transparent.png"
        alt="ByReiXwift"
        width={isCompact ? 34 : 40}
        height={isCompact ? 34 : 40}
        className={isCompact ? "h-[2.1rem] w-auto" : "h-[2.35rem] w-auto"}
      />

      {/* Wordmark - Gradient text */}
      <span
        className={`bg-linear-to-r from-(--byreix-gold-soft) via-(--byreix-gold) to-[#ead39e] bg-clip-text font-semibold tracking-[-0.035em] text-transparent ${
          isCompact
            ? "text-[1.42rem] sm:text-[1.5rem]"
            : "text-[1.54rem] sm:text-[1.66rem]"
        }`}
        style={{ fontFamily: "var(--font-heading)" }}
      >
        ByReiXwift
      </span>
    </div>
  );
}
