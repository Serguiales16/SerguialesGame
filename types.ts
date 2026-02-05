export enum GameStatus {
  PLAYING = 'Jugando',
  PAUSED = 'Pausado',
  COMPLETED = 'Completado',
  ABANDONED = 'Abandonado',
  WISHLIST = 'Lista de deseos'
}

export interface Session {
  id: string;
  date: string; // ISO string
  durationMinutes: number;
  notes: string;
  sentiment?: 'positive' | 'neutral' | 'frustrated';
}

export interface Game {
  id: string;
  title: string;
  platform: string;
  status: GameStatus;
  completionPercentage: number; // 0-100
  coverUrl?: string; // Optional placeholder
  sessions: Session[];
  lastPlayed?: string; // ISO String
  notes: string; // General game notes
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  tags: string[]; // e.g., 'Mecánica', 'Historia', 'Personaje'
  priority: 'low' | 'medium' | 'high';
}

export interface AppProject {
  id: string;
  name: string;
  description: string;
  url?: string;
  techStack: string[];
  status: 'Development' | 'Live' | 'Maintenance';
}

export interface LearningItem {
  id: string;
  topic: string;
  category: string; // e.g., 'Frontend', 'Backend', 'Design'
  status: 'To Learn' | 'Learning' | 'Mastered';
  notes?: string;
}

export interface AIResponse {
  text: string;
  actions?: string[];
}

// Authentication Types
export interface User {
  username: string;
  password: string; // Plain text (solo para uso local)
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: string | null;
}