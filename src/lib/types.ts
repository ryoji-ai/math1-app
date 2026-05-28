// 方針選択ドリル：問題を見て「どの公式・手法を使うか」をまず選ばせる
export type Problem = {
  id: string;
  unitId: string;
  groupId: string; // 進捗集計の単位（グローバルに一意）
  topic: string;
  level: "基礎" | "標準" | "応用";
  question: string; // 問題文（Unicode数式）
  figure: string | null; // 図・表の説明（MVPはテキスト）
  strategy: {
    prompt: string;
    choices: string[];
    answerIndex: number;
    why: string; // 見分けの極意（正解の理由）
    commonMistake?: { choice: string; whyWrong: string };
  };
  answer: string;
  solution: string[];
};

export type Group = {
  id: string; // 例: trig-cosine
  unitId: string;
  name: string;
  description: string;
};

export type Unit = {
  id: string; // 例: trig
  name: string; // 例: 図形と計量（三角比）
  short: string; // ナビ用の短い名前
  description: string;
  guide: {
    title: string;
    intro: string;
    rules: string[]; // 見分け方の判断フロー
  };
};

// --- 進捗 ---
export type ProgressEntry = {
  attempts: number;
  correct: number;
  lastAnsweredAt: string;
  recentResults: boolean[];
};

export type Progress = Record<string, ProgressEntry>;

export type AppState = {
  progress: Progress;
  streakDays: number;
  lastStudyDate: string | null;
};
