import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  showTagline = true,
  className = "",
  onClick,
}) => {
  // Dimensions mapping
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl sm:text-3xl",
    xl: "text-3xl sm:text-4xl",
  };

  const taglineSizes = {
    sm: "text-[8px] tracking-[0.2em]",
    md: "text-[9px] tracking-[0.24em]",
    lg: "text-[11px] tracking-[0.28em]",
    xl: "text-[13px] tracking-[0.3em]",
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* Dynamic Vector Logo matching the ArthaAI Emblem (A with upward growth arrow + Tricolor Swooshes) */}
      <svg
        viewBox="0 0 120 110"
        className={`${iconSizes[size]} shrink-0 drop-shadow-xs`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="arthaBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="arthaArrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0066FF" />
          </linearGradient>
          <linearGradient id="saffronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9933" />
            <stop offset="100%" stopColor="#E65100" />
          </linearGradient>
          <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#138808" />
            <stop offset="100%" stopColor="#0D6505" />
          </linearGradient>
        </defs>

        {/* Left Leg of A */}
        <path
          d="M52 14 C48 14 43 18 38 27 L10 88 C7 94 9 100 15 100 C20 100 24 96 28 88 L46 48 C48 44 52 40 56 40 C60 40 64 44 68 52 L88 92 C92 98 96 100 101 100 C107 100 110 94 106 86 L64 24 C59 17 55 14 52 14 Z"
          fill="url(#arthaBlueGrad)"
        />

        {/* Dynamic Arrow Head on Top Right Leg */}
        <path
          d="M84 46 L108 34 L103 59 L96 52 L84 66 L78 60 L90 46 Z"
          fill="url(#arthaArrowGrad)"
        />

        {/* Saffron Swoosh (Upper Tiranga Ribbon) */}
        <path
          d="M32 98 C36 84 50 72 68 66 C78 63 86 58 92 50 C88 60 76 70 64 76 C48 83 38 92 32 98 Z"
          fill="url(#saffronGrad)"
        />

        {/* Green Swoosh (Lower Tiranga Ribbon) */}
        <path
          d="M36 102 C42 90 56 80 74 74 C86 70 94 64 100 56 C94 67 82 78 68 84 C52 91 42 98 36 102 Z"
          fill="url(#greenGrad)"
        />
      </svg>

      {/* Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-baseline">
          <span
            className={`font-black tracking-tight text-slate-900 dark:text-white ${textSizes[size]}`}
          >
            Artha
          </span>
          <span
            className={`font-black tracking-tight text-blue-600 dark:text-blue-400 ${textSizes[size]}`}
          >
            AI
          </span>
        </div>

        {showTagline && (
          <div className="mt-0.5 flex flex-col">
            <span
              className={`font-extrabold uppercase text-slate-700 dark:text-slate-300 ${taglineSizes[size]}`}
            >
              Your AI Business Officer
            </span>
            {/* Tricolor underline accent */}
            <div className="mt-1 flex items-center gap-1">
              <span className="h-[2px] w-5 rounded-full bg-amber-500" />
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
              <span className="h-[2px] w-5 rounded-full bg-emerald-600" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
