export interface WordItem {
  id: string;
  text: string;
  wrongOption1: string;
  wrongOption2: string;
  classes: string[];
}

export interface GameState {
  view: 'student' | 'teacher' | 'game';
  selectedClass: string | null;
  score: number;
}

export type LocalStorageData = {
  classes: string[];
  words: WordItem[];
};