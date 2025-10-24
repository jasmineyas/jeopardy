export type QuestionType = "text" | "image" | "video" | "audio";

export interface Theme {
  primaryColor: string;
  textColor: string;
  backgroundColor: string;
  answerBoxColor?: string;
  answerAccentColor?: string;
}

export interface Board {
  columns: number;
  rows: number;
}

export interface Question {
  value: number;
  type: QuestionType;
  question: string;
  answer: string;
  media?: string;
  hintImage?: string;
  answerImage?: string;
}

export interface Category {
  name: string;
  questions: Question[];
}

export interface GameConfig {
  title: string;
  theme: Theme;
  board: Board;
  categories: Category[];
}

export interface CurrentQuestion {
  categoryIndex: number;
  questionIndex: number;
  data: Question;
}
