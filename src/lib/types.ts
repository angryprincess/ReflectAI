export type Category = 'Work' | 'Personal' | 'Health' | 'Ideas' | 'Gratitude' | 'Other';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string; // ISO string format
  category: Category;
  tags: string[];
  mood?: 'positive' | 'neutral' | 'negative'; // Optional: AI can populate this
  reflectionScore?: number; // Optional: AI can populate this
}

export interface MoodTrendPoint {
  date: string;
  mood: 'positive' | 'neutral' | 'negative';
  score: number;
}

export interface AiInsights {
  reflectionScore: number;
  recurringThemes: string[];
  sentimentAnalysis: string;
}
