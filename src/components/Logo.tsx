import React from "react";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  variant?: "icon-only" | "horizontal" | "vertical" | "badge";
  className?: string;
  inverted?: boolean;
}

export default function Logo({
  size = "md",
  variant = "horizontal",
  className = "",
  inverted = false,
}: LogoProps) {
  // Size conversion
  const sizeClasses = {
    xs: "w-7 h-7 text-xs",
    sm: "w-9 h-9 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
    xl: "w-24 h-24 text-xl",
    "2xl": "w-36 h-36 text-2xl"
  };

  const svgSize = {
    xs: 28,
    sm: 36,
    md: 48,
    lg: 64,
    xl: 96,
    "2xl": 144
  }[size];

  // Colors based on branding guidelines:
  // Royal Plum: #3B1E43, Rose Gold: #B76E79, Velvet Velvet: #682C53, Warm Off-White: #FBF8F3
  const isDarkBg = variant === "badge";
  
  // Custom SVG path drawing the elegant woman profile with calligraphy and speech bubble sparkle
  const renderSVG = () => {
    return (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="select-none filter drop-shadow-[0_2px_4px_rgba(59,30,67,0.1)] transition-transform duration-300 hover:scale-[1.03]"
      >
        <defs>
          <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B1E43" />
            <stop offset="50%" stopColor="#4A2554" />
            <stop offset="100%" stopColor="#682C53" />
          </linearGradient>
          <linearGradient id="roseGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0A899" />
            <stop offset="50%" stopColor="#B76E79" />
            <stop offset="100%" stopColor="#8C4D57" />
          </linearGradient>
          <linearGradient id="goldGleam" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B76E79" />
            <stop offset="100%" stopColor="#F9D4BB" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Circular Premium Background if not inverted/transparent or if badge is selected */}
        {(variant === "badge" || !inverted) && (
          <circle cx="50" cy="50" r="48" fill="url(#brandGradient)" stroke="url(#roseGoldGradient)" strokeWidth="1.5" />
        )}

        {/* Glow Ring */}
        <circle cx="50" cy="50" r="44" stroke="#B76E79" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />

        {/* Woman Silhouette with Calligraphic Flow "فض" in her hair */}
        {/* Drawn accurately with smooth cubic beziers matching the prestigious logo */}
        <g filter="url(#glow)">
          {/* Hair back swirl */}
          <path
            d="M 40 25 C 28 28, 22 45, 30 65 C 33 72, 40 78, 48 76 C 44 70, 41 60, 42 50 C 43 40, 47 30, 40 25 Z"
            fill="url(#roseGoldGradient)"
            opacity="0.25"
          />

          {/* Core Calligraphy Path representing woman's face & Arabic letters */}
          <path
            d="M38 23C47 20 54 28 54 36C54 41 57 40 59 42C61 44 59 47 60 50C61 53 58 55 57 58C56 60 52 62 49 61C53 66 58 64 61 60C64 56 68 53 65 47C62 41 59 36 54 25C48 18 36 21 34 29C32 37 38 48 45 54C47 56 50 54 48 51C42 45 38 38 38 23Z"
            fill="url(#roseGoldGradient)"
          />

          {/* Stylized Arabic "ض" dot */}
          <circle cx="49" cy="38" r="3.5" fill="url(#goldGleam)" />

          {/* The flowing swoop on the left/lower hair braid */}
          <path
            d="M 33 60 C 37 45, 45 42, 51 45 C 45 49, 41 52, 45 61 C 48 68, 54 75, 62 72 C 53 78, 43 78, 38 72 C 34 68, 32 64, 33 60 Z"
            fill="url(#roseGoldGradient)"
          />

          {/* Elegant Speech Bubble at her right */}
          <path
            d="M62 43C61.2 41 62.5 37 66 35C71 32 77 34 78 39C79 44 74 49 69 49C67.5 49 66 50 64.5 51.5C64.3 51.7 64 51 64 50.5C64 48 63 45 62 43Z"
            fill="url(#goldGleam)"
          />

          {/* 4-point Sparkle Star inside speech bubble */}
          <path
            d="M 70 37 C 70 39.5, 71.5 41, 74 41 C 71.5 41, 70 42.5, 70 45 C 70 42.5, 68.5 41, 66 41 C 68.5 41, 70 39.5, 70 37 Z"
            fill="#3B1E43"
          />
        </g>
      </svg>
    );
  };

  const textPrimaryClass = inverted ? "text-warm" : "text-plum";
  const textSecondaryClass = inverted ? "text-rose-gold/90" : "text-slate-500";

  if (variant === "icon-only") {
    return (
      <div className={`shrink-0 flex items-center justify-center ${sizeClasses[size]} ${className}`} id="fdfada-logo-icon">
        {renderSVG()}
      </div>
    );
  }

  if (variant === "vertical") {
    return (
      <div className={`flex flex-col items-center text-center gap-3 ${className}`} id="fdfada-logo-vertical">
        <div className={sizeClasses[size]}>{renderSVG()}</div>
        <div className="space-y-0.5" dir="rtl">
          <h1 className={`font-black tracking-tight text-xl md:text-2xl ${textPrimaryClass} font-sans`}>
            فضفضة
          </h1>
          <p className="text-[10px] md:text-xs font-mono tracking-widest text-[#B76E79] font-bold">
            fdfada.online
          </p>
        </div>
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div className={`bg-gradient-to-br from-plum to-velvet text-white rounded-[2rem] p-6 text-center border border-rose-gold/30 shadow-xl flex flex-col items-center gap-4 ${className}`} dir="rtl" id="fdfada-logo-presentation-badge">
        <div className={sizeClasses[size]}>{renderSVG()}</div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-rose-gold drop-shadow-sm font-sans tracking-wide">
            فَضْفَضَة
          </h2>
          <p className="text-[10px] font-mono tracking-widest text-rose-gold/80 font-semibold uppercase">
            fdfada.online
          </p>
          <div className="w-12 h-[1px] bg-rose-gold/30 mx-auto my-1.5"></div>
          <p className="text-[9px] text-warm/80 font-extrabold px-1">
            منصّتكِ الآمنة للبوح المجهول والتمكين النفسي
          </p>
        </div>
      </div>
    );
  }

  // default: horizontal
  return (
    <div className={`flex items-center gap-3.5 ${className}`} id="fdfada-logo-horizontal" dir="rtl">
      <div className={sizeClasses[size]}>{renderSVG()}</div>
      <div className="text-right" dir="rtl">
        <span className={`font-black text-base md:text-lg block leading-none tracking-wide text-plum font-sans flex items-center gap-1.5`}>
          فَضْفَضَة <span className="bg-rose-gold/10 text-rose-gold border border-rose-gold/20 px-2 py-0.5 rounded-full text-[9px] font-black">أونلاين</span>
        </span>
        <span className="text-[9px] md:text-[10px] text-rose-gold font-bold tracking-wide block mt-1">
          fdfada.online • ملتقى الأمان والتمكين الوجداني 🌸🗝️
        </span>
      </div>
    </div>
  );
}
