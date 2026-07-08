export interface DocumentStats {
  name: string;
  type: string;
  pages: number;
  chunks: number;
  wordCount: number;
  readingTime: string;
  confidence: number;
  status: "idle" | "uploading" | "processing" | "completed" | "failed";
  size: string;
  uploadDate: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  userSelection?: string | null;
  isRevealed?: boolean;
  explanation?: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface DocumentData {
  document_id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  summary: string;
  notes: string;
  quiz: QuizQuestion[] | string;
  flashcards: Flashcard[] | string;
  stats: DocumentStats;
}

export interface DocumentItem {
  id: number | string;
  filename: string;
  file_type: string;
  created_at: string;
  last_opened?: string;
}

export type ActiveTab = "home" | "workspace";

export type AIActionType = "chat" | "summary" | "notes" | "quiz" | "flashcards";
