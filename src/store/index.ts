import { create } from 'zustand';
import * as storage from '@/lib/storage';
import type { Certificate, NoteEntry } from '@/types/storage';

interface KernalState {
  // UI
  theme: 'dark' | 'light';
  mode: 'learn' | 'reference';
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;

  // Progress
  progress: Record<string, boolean>;
  quizScores: Record<string, { score: number; total: number; attempts: number; lastAttempt: string }>;
  streak: { count: number; lastDate: string; longestStreak: number };
  badges: string[];

  // Bookmarks
  bookmarks: string[];

  // Preferences
  fontSize: number;

  // Certifications
  certifications: Certificate[];

  // Notes
  notes: Record<string, NoteEntry>;

  // Actions
  setTheme: (t: 'dark' | 'light') => void;
  setMode: (m: 'learn' | 'reference') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  markComplete: (lessonId: string) => void;
  markIncomplete: (lessonId: string) => void;
  saveQuizScore: (lessonId: string, score: number, total: number) => void;
  addBadge: (id: string) => void;
  toggleBookmark: (id: string) => void;
  updateStreak: () => void;
  setFontSize: (size: number) => void;
  earnCertificate: (techId: string, techName: string, total: number) => void;
  saveNote: (lessonId: string, entry: NoteEntry) => void;
  deleteNote: (lessonId: string) => void;
  hydrate: () => void;
}

export const useStore = create<KernalState>((set, get) => ({
  theme: 'dark',
  mode: 'learn',
  sidebarOpen: false,
  commandPaletteOpen: false,
  progress: {},
  quizScores: {},
  streak: { count: 0, lastDate: '', longestStreak: 0 },
  badges: [],
  bookmarks: [],
  fontSize: 16,
  certifications: [],
  notes: {},

  setTheme: (theme) => {
    storage.setTheme(theme);
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    set({ theme });
  },

  setMode: (mode) => {
    storage.setMode(mode);
    set({ mode });
  },

  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleCommandPalette: () => set(s => ({ commandPaletteOpen: !s.commandPaletteOpen })),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  markComplete: (lessonId) => {
    storage.markComplete(lessonId);
    storage.updateStreak();
    const streak = storage.getStreak();
    set(s => ({
      progress: { ...s.progress, [lessonId]: true },
      streak,
    }));
  },

  markIncomplete: (lessonId) => {
    storage.markIncomplete(lessonId);
    set(s => {
      const next = { ...s.progress };
      delete next[lessonId];
      return { progress: next };
    });
  },

  saveQuizScore: (lessonId, score, total) => {
    storage.saveQuizScore(lessonId, score, total);
    set({ quizScores: storage.getQuizScores() });
  },

  addBadge: (id) => {
    storage.addBadge(id);
    set(s => ({ badges: [...new Set([...s.badges, id])] }));
  },

  toggleBookmark: (id) => {
    if (get().bookmarks.includes(id)) {
      storage.removeBookmark(id);
      set(s => ({ bookmarks: s.bookmarks.filter(b => b !== id) }));
    } else {
      storage.addBookmark(id);
      set(s => ({ bookmarks: [...s.bookmarks, id] }));
    }
  },

  updateStreak: () => {
    const streak = storage.updateStreak();
    set({ streak });
  },

  setFontSize: (fontSize) => {
    storage.setPrefs({ fontSize });
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
    set({ fontSize });
  },

  saveNote: (lessonId, entry) => {
    if (entry.text.trim()) {
      storage.saveNote(lessonId, entry);
      set(s => ({ notes: { ...s.notes, [lessonId]: entry } }));
    } else {
      storage.deleteNote(lessonId);
      set(s => { const n = { ...s.notes }; delete n[lessonId]; return { notes: n }; });
    }
  },

  deleteNote: (lessonId) => {
    storage.deleteNote(lessonId);
    set(s => { const n = { ...s.notes }; delete n[lessonId]; return { notes: n }; });
  },

  earnCertificate: (techId, techName, total) => {
    const cert: Certificate = {
      id: `cert-${techId}-${new Date().toISOString().slice(0, 10)}`,
      techId,
      techName,
      earnedAt: new Date().toISOString(),
      lessonsCompleted: total,
      totalLessons: total,
    };
    storage.addCertification(cert);
    set({ certifications: storage.getCertifications() });
  },

  hydrate: () => {
    const theme = storage.getTheme();
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    set({
      theme,
      mode:       storage.getMode(),
      progress:   storage.getProgress(),
      quizScores: storage.getQuizScores(),
      streak:     storage.getStreak(),
      badges:     storage.getBadges(),
      bookmarks:  storage.getBookmarks(),
      fontSize:        storage.getPrefs().fontSize,
      certifications:  storage.getCertifications(),
      notes:           storage.getNotes(),
    });
  },
}));
