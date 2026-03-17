import Image from "next/image";

export function ByreixLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {/* Logo Icon */}
      <Image
        src="/logo_transparent.png"
        alt="ByReiXwift"
        width={36}
        height={36}
        className="h-9 w-auto"
      />

      {/* Wordmark - Gradient text */}
      <span
        className="text-xl font-semibold tracking-wide bg-linear-to-r from-(--byreix-gold-soft) via-(--byreix-gold) to-[#e3cf8c] bg-clip-text text-transparent"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        ByReiXwift
      </span>
    </div>
  );
}
