import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "Software Engineer" | "UI/UX Designer" | "Business Analyst" | null;
export type Mode = "Practice" | "Interview" | null;
export type Round = "Technical" | "Behavioural" | null;
export type Personality = "Friendly" | "Strict" | "Neutral" | null;

export interface Answer {
  questionId: string;
  question: string;
  answer: string;
}

interface State {
  role: Role;
  mode: Mode;
  round: Round;
  personality: Personality;
  answers: Answer[];
  setRole: (role: Role) => void;
  setMode: (mode: Mode) => void;
  setRound: (round: Round) => void;
  setPersonality: (p: Personality) => void;
  addAnswer: (answer: Answer) => void;
  reset: () => void;
}

const AppStateContext = createContext<State | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [mode, setMode] = useState<Mode>(null);
  const [round, setRound] = useState<Round>(null);
  const [personality, setPersonality] = useState<Personality>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const addAnswer = (answer: Answer) => {
    setAnswers((prev) => [...prev, answer]);
  };

  const reset = () => {
    setRole(null);
    setMode(null);
    setRound(null);
    setPersonality(null);
    setAnswers([]);
  };

  return (
    <AppStateContext.Provider
      value={{
        role,
        mode,
        round,
        personality,
        answers,
        setRole,
        setMode,
        setRound,
        setPersonality,
        addAnswer,
        reset,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
