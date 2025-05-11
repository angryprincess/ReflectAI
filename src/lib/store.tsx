'use client';
import type { JournalEntry, AiInsights, MoodTrendPoint } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { formatISO } from 'date-fns';

interface AppState {
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'date'> & { date?: Date }) => void;
  updateJournalEntry: (entry: JournalEntry) => void;
  deleteJournalEntry: (id: string) => void;
  getJournalEntryById: (id: string) => JournalEntry | undefined;
  aiInsights: AiInsights | null;
  setAiInsights: (insights: AiInsights | null) => void;
  moodTrends: MoodTrendPoint[];
  setMoodTrends: (trends: MoodTrendPoint[]) => void;
  isLoadingAi: boolean;
  setIsLoadingAi: (loading: boolean) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

const initialEntries: JournalEntry[] = [
  {
    id: uuidv4(),
    title: 'First Day with ReflectAI',
    content: "Feeling excited to start this journaling journey. I hope to gain some insights into my thought patterns and improve my self-awareness. Today was productive at work, finished the main report. Need to remember to take more breaks tomorrow. Also, planning to start a new fitness routine.",
    date: formatISO(new Date(2024, 6, 15)), // July 15, 2024
    category: 'Personal',
    tags: ['new beginnings', 'productivity', 'self-care'],
    mood: 'positive',
    reflectionScore: 75,
  },
  {
    id: uuidv4(),
    title: 'A Bit Stressed',
    content: "Work was overwhelming today. Too many meetings and deadlines looming. I felt a bit anxious throughout the day. Tried a 10-minute meditation in the evening, which helped a little. I should probably write more about this stress to understand it better.",
    date: formatISO(new Date(2024, 6, 16)), // July 16, 2024
    category: 'Work',
    tags: ['stress', 'anxiety', 'meditation'],
    mood: 'negative',
    reflectionScore: 60,
  },
  {
    id: uuidv4(),
    title: 'Small Wins',
    content: "Managed to complete a difficult task at work that I was procrastinating on. Felt a good sense of accomplishment. Also, went for a walk during lunch. It's the small things! Grateful for a supportive colleague who helped out.",
    date: formatISO(new Date(2024, 6, 17)), // July 17, 2024
    category: 'Work',
    tags: ['accomplishment', 'gratitude', 'procrastination'],
    mood: 'positive',
    reflectionScore: 80,
  }
];

export const AppStoreProvider = ({ children }: { children: ReactNode }) => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [aiInsights, setAiInsights] = useState<AiInsights | null>(null);
  const [moodTrends, setMoodTrends] = useState<MoodTrendPoint[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load from localStorage if available, otherwise use initialEntries
    const storedEntries = localStorage.getItem('reflectai-journalEntries');
    if (storedEntries) {
      setJournalEntries(JSON.parse(storedEntries));
    } else {
      setJournalEntries(initialEntries);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('reflectai-journalEntries', JSON.stringify(journalEntries));
    }
  }, [journalEntries, isInitialized]);

  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'date'> & { date?: Date }) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: uuidv4(),
      date: entry.date ? formatISO(entry.date) : formatISO(new Date()),
    };
    setJournalEntries(prevEntries => [newEntry, ...prevEntries]);
  };

  const updateJournalEntry = (updatedEntry: JournalEntry) => {
    setJournalEntries(prevEntries =>
      prevEntries.map(entry => (entry.id === updatedEntry.id ? updatedEntry : entry))
    );
  };

  const deleteJournalEntry = (id: string) => {
    setJournalEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
  };
  
  const getJournalEntryById = (id: string) => {
    return journalEntries.find(entry => entry.id === id);
  };

  return (
    <AppContext.Provider value={{ 
      journalEntries, 
      addJournalEntry, 
      updateJournalEntry, 
      deleteJournalEntry,
      getJournalEntryById,
      aiInsights, 
      setAiInsights,
      moodTrends,
      setMoodTrends,
      isLoadingAi,
      setIsLoadingAi
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppStoreProvider');
  }
  return context;
};
