import { motion } from "framer-motion";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className ?? ""}`}>
      {/* Outer pulse rings */}
      <span
        className="absolute inset-0 m-auto w-40 h-40 rounded-full pulse-ring"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.25) 0%, rgba(59,130,246,0) 70%)",
        }}
      />
      <span
        className="absolute inset-0 m-auto w-40 h-40 rounded-full pulse-ring"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(59,130,246,0) 70%)",
          animationDelay: "1.3s",
        }}
      />
      {/* Soft outer glow */}
      <span
        className="absolute inset-0 m-auto w-44 h-44 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.35) 0%, rgba(2,6,23,0) 65%)",
          filter: "blur(8px)",
        }}
      />

      <motion.div
        className="relative float-y"
        animate={{ rotate: [0, 1.5, -1.5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width="140"
          height="140"
          viewBox="0 0 120 120"
          fill="none"
          className="text-primary"
          style={{ filter: "drop-shadow(0 0 22px rgba(59, 130, 246, 0.65))" }}
        >
          <defs>
            <radialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.1" />
            </radialGradient>
            <linearGradient id="brainStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* Inner glow */}
          <circle cx="60" cy="60" r="38" fill="url(#brainGlow)" opacity="0.55" />

          {/* Brain silhouette */}
          <g
            stroke="url(#brainStroke)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            <path d="M60 28c-6-6-18-6-22 2-6 1-11 6-11 13 0 4 2 7 4 9-3 3-4 7-3 11 1 5 6 9 11 9 1 4 5 7 9 7 4 0 8-2 12-5" />
            <path d="M60 28c6-6 18-6 22 2 6 1 11 6 11 13 0 4-2 7-4 9 3 3 4 7 3 11-1 5-6 9-11 9-1 4-5 7-9 7-4 0-8-2-12-5" />
            <path d="M60 28v52" />
            <path d="M44 46c4 0 7 3 7 7" />
            <path d="M76 46c-4 0-7 3-7 7" />
            <path d="M40 64c4 0 7 2 9 5" />
            <path d="M80 64c-4 0-7 2-9 5" />
          </g>

          {/* Neural nodes */}
          <g fill="#60a5fa">
            <circle cx="44" cy="46" r="2.2" />
            <circle cx="76" cy="46" r="2.2" />
            <circle cx="40" cy="64" r="2.2" />
            <circle cx="80" cy="64" r="2.2" />
            <circle cx="51" cy="53" r="1.8" />
            <circle cx="69" cy="53" r="1.8" />
            <circle cx="60" cy="80" r="2.4" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
