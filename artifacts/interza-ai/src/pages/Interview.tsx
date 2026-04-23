import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAppState } from "@/lib/store";
import { getQuestions, Question } from "@/lib/questions";
import { speakText, cancelSpeech } from "@/lib/speech";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Play, ArrowRight, VideoOff } from "lucide-react";

export function Interview() {
  const [, setLocation] = useLocation();
  const { role, mode, round, personality, addAnswer, reset } = useAppState();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState(false);

  // Redirect if accessed directly without setup
  useEffect(() => {
    if (!role || !mode || !personality || (mode === "Interview" && !round)) {
      setLocation("/setup");
      return;
    }
    const qList = getQuestions(role, mode, round);
    setQuestions(qList);
    // Auto-speak first question after slight delay to ensure render
    const timer = setTimeout(() => {
      if (qList.length > 0) {
        speakText(qList[0].text, personality);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Camera setup
  useEffect(() => {
    let stream: MediaStream | null = null;
    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setCameraError(true);
      }
    }
    setupCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      cancelSpeech();
    };
  }, []);

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleNext = () => {
    addAnswer({
      questionId: currentQ.id,
      question: currentQ.text,
      answer: answerText,
    });

    if (currentIndex < questions.length - 1) {
      setAnswerText("");
      setCurrentIndex((prev) => prev + 1);
      speakText(questions[currentIndex + 1].text, personality!);
    } else {
      cancelSpeech();
      setLocation("/feedback");
    }
  };

  const replayVoice = () => {
    speakText(currentQ.text, personality!);
  };

  return (
    <div className="min-h-screen w-full flex flex-col p-4 md:p-6 lg:p-8 space-y-6">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-2 pb-4 border-b border-border/50"
      >
        <Badge variant="outline" className="px-3 py-1 font-medium">{role}</Badge>
        <Badge variant="secondary" className="px-3 py-1 text-primary bg-primary/10">{mode}</Badge>
        {round && <Badge variant="outline" className="px-3 py-1">{round}</Badge>}
        <Badge variant="outline" className="px-3 py-1">{personality}</Badge>
        
        <div className="ml-auto font-mono text-muted-foreground">
          {formatTime(elapsedTime)}
        </div>
      </motion.header>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Left Side: Question and Answer */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col space-y-6 lg:w-[60%]"
        >
          <div className="space-y-4 flex-1">
            <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              Question {currentIndex + 1} of {questions.length}
            </h2>
            <p className="text-2xl md:text-3xl font-medium leading-relaxed">
              {currentQ.text}
            </p>
          </div>

          <div className="space-y-4">
            <Textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type your answer here, or just practice speaking aloud and take notes..."
              className="min-h-[200px] text-lg p-4 resize-y bg-card/50"
            />
            <div className="flex items-center justify-between">
              <Button variant="secondary" onClick={replayVoice}>
                <Play className="w-4 h-4 mr-2" />
                Replay Voice
              </Button>
              <Button onClick={handleNext} disabled={!answerText.trim() && mode !== "Practice"}>
                {currentIndex === questions.length - 1 ? "Finish Interview" : "Next Question"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Camera */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-[40%] flex flex-col gap-4"
        >
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-card border border-border glow-border relative shadow-lg">
            {cameraError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-6 text-center space-y-4">
                <VideoOff className="w-12 h-12 opacity-50" />
                <p>Camera access denied or unavailable. You can still proceed with text answers.</p>
              </div>
            ) : (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </motion.div>
      </div>

      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-4 border-t border-border/50"
      >
        <Progress value={progress} className="h-2 mb-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{currentIndex} answered</span>
          <span>{questions.length - currentIndex} remaining</span>
        </div>
      </motion.footer>
    </div>
  );
}
