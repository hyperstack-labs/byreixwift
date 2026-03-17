export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          {/* Gold B with glow effect */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* B Letter */}
          <path
            d="M8 8H18C21.866 8 25 11.134 25 15C25 16.933 24.2 18.683 22.9 19.95C24.7 21.3 26 23.5 26 26C26 29.866 22.866 33 19 33H8V8ZM14 18H18C19.657 18 21 16.657 21 15C21 13.343 19.657 12 18 12H14V18ZM14 29H19C20.657 29 22 27.657 22 26C22 24.343 20.657 23 19 23H14V29Z"
            fill="#D4AF37"
            filter="url(#glow)"
          />

          {/* Signal waves */}
          <path
            d="M28 10C28 10 30 12 30 15C30 18 28 20 28 20"
            stroke="#D4AF37"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M31 7C31 7 34 10 34 15C34 20 31 23 31 23"
            stroke="#D4AF37"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* Green X slash */}
          <path d="M26 11L35 29" stroke="#26D578" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <span className="text-xl font-bold tracking-tight">ByReiXwift</span>
    </div>
  );
}
