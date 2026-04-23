import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAppState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RotateCcw, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";

interface FeedbackData {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
}

export function Feedback() {
  const [, setLocation] = useLocation();
  const { answers, reset } = useAppState();
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);

  useEffect(() => {
    if (answers.length === 0) {
      setLocation("/");
      return;
    }

    // Heuristics
    const avgLength = answers.reduce((acc, a) => acc + a.answer.length, 0) / answers.length;
    
    // Mock score 65-95 based on avg length (assume ~200 chars is good)
    const baseScore = 65;
    const lengthBonus = Math.min(30, (avgLength / 200) * 30);
    const finalScore = Math.round(baseScore + lengthBonus);

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const improvements: string[] = [];

    if (avgLength > 150) {
      strengths.push("Detailed and comprehensive answers.");
    } else {
      weaknesses.push("Answers were quite brief.");
      improvements.push("Elaborate more on your points.");
    }

    const hasExamples = answers.some(a => a.answer.toLowerCase().includes("example") || a.answer.toLowerCase().includes("instance"));
    if (hasExamples) {
      strengths.push("Good use of examples to support points.");
    } else {
      improvements.push("Incorporate specific examples or case studies.");
    }

    if (answers.length >= 8) {
      strengths.push("Maintained focus throughout a full session.");
    }

    if (avgLength < 50) {
      weaknesses.push("Lacked depth in critical areas.");
    }

    // Pad arrays to 3 items with generic feedback if needed
    while(strengths.length < 3) strengths.push(
      "Clear communication style.",
      "Professional tone maintained.",
      "Good alignment with role expectations."
    )[strengths.length];
    
    while(weaknesses.length < 3) weaknesses.push(
      "Could bridge topics more smoothly.",
      "Sometimes hesitated before core points.",
      "Technical depth could be expanded."
    )[weaknesses.length];

    while(improvements.length < 3) improvements.push(
      "Structure answers using the STAR method.",
      "Take a moment to pause before responding.",
      "Connect answers back to business impact."
    )[improvements.length];

    setFeedback({
      score: finalScore,
      strengths: strengths.slice(0, 3),
      weaknesses: weaknesses.slice(0, 3),
      improvements: improvements.slice(0, 3)
    });
  }, [answers]);

  if (!feedback) return null;

  const handleRestart = () => {
    reset();
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full p-6 md:p-10 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl space-y-10"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-4xl font-bold tracking-tight">Interview Completed</h1>
            <p className="text-muted-foreground text-lg">Here is your AI-generated performance review.</p>
          </div>
          
          <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-4 border-primary/20 glow">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="64" cy="64" r="60"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="4"
                strokeDasharray="377"
                strokeDashoffset={377 - (377 * feedback.score) / 100}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="text-center">
              <span className="text-3xl font-bold glow-text">{feedback.score}</span>
              <span className="text-sm text-muted-foreground block">/ 100</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeedbackCard 
            title="Key Strengths" 
            items={feedback.strengths} 
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            className="border-emerald-500/20"
          />
          <FeedbackCard 
            title="Areas to Watch" 
            items={feedback.weaknesses} 
            icon={<AlertCircle className="w-5 h-5 text-amber-500" />}
            className="border-amber-500/20"
          />
          <FeedbackCard 
            title="How to Improve" 
            items={feedback.improvements} 
            icon={<ArrowUpRight className="w-5 h-5 text-primary" />}
            className="border-primary/20"
          />
        </div>

        <div className="flex justify-center pt-8">
          <Button size="lg" onClick={handleRestart} variant="outline" className="px-8 h-12">
            <RotateCcw className="w-4 h-4 mr-2" />
            Start New Session
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function FeedbackCard({ title, items, icon, className }: { title: string, items: string[], icon: React.ReactNode, className?: string }) {
  return (
    <Card className={`bg-card/50 ${className}`}>
      <CardHeader className="pb-3 flex flex-row items-center gap-3 space-y-0">
        {icon}
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-start text-sm text-muted-foreground">
              <span className="mr-2 mt-1 w-1.5 h-1.5 rounded-full bg-muted-foreground/50 shrink-0" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
