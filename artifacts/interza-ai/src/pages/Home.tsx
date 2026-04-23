import { motion } from "framer-motion";
import { Link } from "wouter";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 flex flex-col items-center text-center space-y-8"
      >
        <Logo className="mb-4" />
        
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-widest text-foreground glow-text">
            INTERZA AI
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
            Master Every Interview with Confidence.
          </p>
        </div>

        <Link href="/setup">
          <Button size="lg" className="h-14 px-8 text-lg rounded-full font-semibold mt-8 glow shadow-lg hover:shadow-xl transition-all duration-300">
            Start Interview
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
