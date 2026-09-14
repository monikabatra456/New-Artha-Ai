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
  const iconSizes = {
    sm: "h-14 w-14 sm:h-16 sm:w-16",
    md: "h-[4.5rem] w-[4.5rem]",
    lg: "h-24 w-24",
    xl: "h-28 w-28",
  };

  const textSizes = {
    sm: "text-2xl sm:text-3xl",
    md: "text-3xl",
    lg: "text-4xl",
    xl: "text-5xl",
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
      className={`inline-flex items-center gap-3.5 select-none ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      <img
        src="/logo.png"
        alt="ArthaAI"
        className={`${iconSizes[size]} shrink-0 bg-transparent object-contain`}
      />

      <div className="flex flex-col">
        <div className="flex items-baseline">
          <span
            className={`font-display font-semibold tracking-tight text-[#12233a] dark:text-white ${textSizes[size]}`}
          >
            Artha
          </span>
          <span
            className={`font-display font-semibold tracking-tight text-blue-600 dark:text-blue-400 ${textSizes[size]}`}
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
