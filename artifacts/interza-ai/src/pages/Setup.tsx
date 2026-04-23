import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppState, Role, Mode, Round, Personality } from "@/lib/store";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const roles: Role[] = ["Software Engineer", "UI/UX Designer", "Business Analyst"];
const modes: Mode[] = ["Practice", "Interview"];
const rounds: Round[] = ["Technical", "Behavioural"];
const personalities: Personality[] = ["Friendly", "Neutral", "Strict"];

export function Setup() {
  const [, setLocation] = useLocation();
  const { role, setRole, mode, setMode, round, setRound, personality, setPersonality } = useAppState();

  const isComplete = role && mode && personality && (mode === "Practice" || round);

  const handleContinue = () => {
    if (isComplete) {
      setLocation("/interview");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl space-y-10"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Session Setup</h1>
          <p className="text-muted-foreground">Configure your AI mock interview experience.</p>
        </div>

        <div className="space-y-8">
          <Section title="1. Select Role">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map((r) => (
                <SelectCard
                  key={r}
                  selected={role === r}
                  onClick={() => setRole(r)}
                  label={r!}
                />
              ))}
            </div>
          </Section>

          <Section title="2. Select Mode">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modes.map((m) => (
                <SelectCard
                  key={m}
                  selected={mode === m}
                  onClick={() => setMode(m)}
                  label={m!}
                />
              ))}
            </div>
          </Section>

          {mode === "Interview" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <Section title="Interview Round">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rounds.map((r) => (
                    <SelectCard
                      key={r}
                      selected={round === r}
                      onClick={() => setRound(r)}
                      label={r!}
                    />
                  ))}
                </div>
              </Section>
            </motion.div>
          )}

          <Section title="3. AI Personality">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {personalities.map((p) => (
                <SelectCard
                  key={p}
                  selected={personality === p}
                  onClick={() => setPersonality(p)}
                  label={p!}
                />
              ))}
            </div>
          </Section>
        </div>

        <div className="flex justify-end pt-8">
          <Button
            size="lg"
            disabled={!isComplete}
            onClick={handleContinue}
            className={cn("px-10 h-12 text-base", isComplete && "glow")}
          >
            Start Session
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-foreground/90">{title}</h2>
      {children}
    </div>
  );
}

function SelectCard({ selected, onClick, label }: { selected: boolean; onClick: () => void; label: string }) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative p-4 cursor-pointer transition-all duration-200 flex items-center justify-between group",
        selected 
          ? "border-primary bg-primary/10 glow-border" 
          : "border-border hover:border-primary/50 hover:bg-card/80"
      )}
    >
      <span className={cn("font-medium", selected ? "text-primary glow-text" : "text-foreground")}>
        {label}
      </span>
      {selected && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <Check className="w-5 h-5 text-primary" />
        </motion.div>
      )}
    </Card>
  );
}
