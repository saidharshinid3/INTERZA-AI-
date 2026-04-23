import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAppState } from "@/lib/store";
import { getQuestions, Question } from "@/lib/questions";
import {
  speakText,
  cancelSpeech,
  getSpeechRecognition,
  isSpeechRecognitionSupported,
} from "@/lib/speech";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  ArrowRight,
  VideoOff,
  Mic,
  MicOff,
  Clock,
  CheckCircle2,
  CircleDashed,
} from "lucide-react";

export function Interview() {
  const [, setLocation] = useLocation();
  const { role, mode, round, personality, addAnswer } = useAppState();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<ReturnType<typeof getSpeechRecognition>>(null);
  const baseTextRef = useRef<string>("");
  const lastSpokenIdRef = useRef<string | null>(null);
  const [cameraError, setCameraError] = useState(false);

  // Init questions only (do NOT speak here — speech is driven by the index effect below)
  useEffect(() => {
    if (!role || !mode || !personality || (mode === "Interview" && !round)) {
      setLocation("/setup");
      return;
    }
    const qList = getQuestions(role, mode, round);
    setQuestions(qList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Single source of truth for speaking the current question.
  // Tracks the last spoken question id so re-renders never replay it.
  const currentQuestionId = questions[currentIndex]?.id ?? null;
  useEffect(() => {
    if (!personality || !currentQuestionId) return;
    if (lastSpokenIdRef.current === currentQuestionId) return;
    const q = questions[currentIndex];
    if (!q) return;
    lastSpokenIdRef.current = currentQuestionId;

    speakText(q.text, personality, {
      key: `q-${currentQuestionId}`,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  }, [currentQuestionId, personality]);

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
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        setCameraError(true);
      }
    }
    setupCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      cancelSpeech();
      stopListening();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const startListening = () => {
    if (!isSpeechRecognitionSupported()) {
      setMicError("Voice input is not supported in this browser. Try Chrome.");
      return;
    }
    setMicError(null);
    const recog = getSpeechRecognition();
    if (!recog) return;
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = "en-US";

    baseTextRef.current = answerText.trim();

    recog.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      const combined = [baseTextRef.current, final.trim(), interim.trim()]
        .filter(Boolean)
        .join(" ");
      setAnswerText(combined);
      if (final) {
        baseTextRef.current = combined;
      }
    };

    recog.onerror = (event: any) => {
      setMicError(`Microphone error: ${event.error || "unknown"}`);
      setIsListening(false);
    };

    recog.onend = () => {
      setIsListening(false);
    };

    try {
      recog.start();
      recognitionRef.current = recog;
      setIsListening(true);
    } catch (err: any) {
      setMicError("Could not start microphone");
      setIsListening(false);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const progress = (currentIndex / questions.length) * 100;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleNext = () => {
    stopListening();
    addAnswer({
      questionId: currentQ.id,
      question: currentQ.text,
      answer: answerText,
    });

    if (currentIndex < questions.length - 1) {
      setAnswerText("");
      baseTextRef.current = "";
      cancelSpeech();
      setCurrentIndex((prev) => prev + 1);
      // Speech for the new question is triggered by the useEffect on currentIndex.
    } else {
      cancelSpeech();
      setLocation("/feedback");
    }
  };

  const replayVoice = () => {
    // Force-allow even if recently spoken by using a unique key.
    speakText(currentQ.text, personality!, {
      key: `q-${currentQ.id}-replay-${Date.now()}`,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <AnimatedBackground particleCount={14} />

      <div className="relative z-10 min-h-screen w-full flex flex-col p-4 md:p-6 lg:p-8 gap-6">
        {/* Top bar */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2 glass rounded-2xl px-4 py-3"
        >
          {[
            { label: role, primary: false },
            { label: mode, primary: true },
            ...(round ? [{ label: round, primary: false }] : []),
            { label: personality, primary: false },
          ].map((b, idx) => (
            <Badge
              key={idx}
              variant={b.primary ? "secondary" : "outline"}
              className={`px-3 py-1 font-medium transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_12px_rgba(59,130,246,0.35)] ${
                b.primary ? "text-primary bg-primary/10 border-primary/30" : ""
              }`}
            >
              {b.label}
            </Badge>
          ))}

          <div className="ml-auto flex items-center gap-2 text-muted-foreground font-mono text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span>{formatTime(elapsedTime)}</span>
          </div>
        </motion.header>

        {/* Body */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col gap-5 lg:w-[60%]"
          >
            <div className="glass-strong rounded-2xl p-6 md:p-8 flex-1 flex flex-col gap-4 glow-hover">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                  Question {currentIndex + 1} / {questions.length}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={replayVoice}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Replay
                </Button>
              </div>
              <motion.p
                key={currentQ.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="text-2xl md:text-3xl font-medium leading-relaxed text-foreground"
              >
                {currentQ.text}
              </motion.p>
            </div>

            <div className="glass rounded-2xl p-4 md:p-5 space-y-3 focus-glow">
              <div className="relative">
                <Textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Type your answer, or tap the mic to speak..."
                  className="min-h-[170px] text-base md:text-lg p-4 pr-14 resize-y bg-background/40 border-border/60 focus-visible:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={toggleMic}
                  aria-label={isListening ? "Stop voice input" : "Start voice input"}
                  className={`absolute bottom-3 right-3 inline-flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200 ${
                    isListening
                      ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(59,130,246,0.7)]"
                      : "bg-card/80 border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.45)]"
                  }`}
                >
                  {isListening ? (
                    <Mic className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 text-sm min-h-[24px]">
                  {isListening ? (
                    <>
                      <span className="listening-dot inline-block w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.9)]" />
                      <span className="text-primary font-medium">Listening...</span>
                    </>
                  ) : micError ? (
                    <span className="text-destructive/90 flex items-center gap-2">
                      <MicOff className="w-4 h-4" /> {micError}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      {isSpeechRecognitionSupported()
                        ? "Tap the mic to speak your answer"
                        : "Voice input unsupported in this browser"}
                    </span>
                  )}
                </div>

                <Button
                  onClick={handleNext}
                  disabled={!answerText.trim() && mode !== "Practice"}
                  className="rounded-full px-6 glow-hover"
                >
                  {currentIndex === questions.length - 1
                    ? "Finish Interview"
                    : "Next Question"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Right: Camera */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-[40%] flex flex-col gap-4"
          >
            <div className="glass-strong rounded-2xl p-3 glow-hover">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/60 glow-border relative">
                {cameraError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-6 text-center space-y-3">
                    <VideoOff className="w-10 h-10 opacity-60" />
                    <p className="text-sm">
                      Camera unavailable. You can still answer with text or voice.
                    </p>
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
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 text-[10px] tracking-wider uppercase text-primary border border-primary/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary listening-dot" />
                  Live
                </span>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Maintain eye contact and posture as if interviewing in person.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4 md:p-5 space-y-3"
        >
          <Progress value={progress} className="h-2 bg-border/40" />
          <div className="flex items-center justify-between text-sm flex-wrap gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>
                <span className="text-foreground font-semibold">{currentIndex}</span>{" "}
                answered
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CircleDashed className="w-4 h-4" />
              <span>
                <span className="text-foreground font-semibold">
                  {questions.length - currentIndex}
                </span>{" "}
                remaining
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground font-mono">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-foreground">{formatTime(elapsedTime)}</span>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
