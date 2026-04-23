import { motion } from "framer-motion";
import { Link } from "wouter";
import { Logo } from "@/components/Logo";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";

export function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <AnimatedBackground particleCount={22} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="z-10 flex flex-col items-center text-center space-y-10"
      >
        <Logo />

        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.25em" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold tracking-widest text-foreground glow-text"
          >
            INTERZA AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto"
          >
            Master Every Interview with Confidence.
          </motion.p>
        </div>

        <Link href="/setup">
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
          >
            <Button
              size="lg"
              className="h-14 px-10 text-lg rounded-full font-semibold mt-6 glow glow-hover"
            >
              Start Interview
            </Button>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}
