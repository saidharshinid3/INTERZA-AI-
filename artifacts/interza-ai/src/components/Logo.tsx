import { motion } from "framer-motion";

export function Logo({ className }: { className?: string }) {
  return (
    <motion.div 
      className={className}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
        style={{ filter: "drop-shadow(0 0 15px rgba(59, 130, 246, 0.6))" }}
      >
        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-5.28 4.787 5.25 5.25 0 0 0 9.152 6.745A5.3 5.3 0 0 0 12 15a5.3 5.3 0 0 0 2.125 1.657 5.25 5.25 0 0 0 9.152-6.745 4 4 0 0 0-5.28-4.787A3 3 0 1 0 12 5z" />
        <path d="M12 15v4" />
        <path d="M9 19h6" />
      </svg>
    </motion.div>
  );
}
