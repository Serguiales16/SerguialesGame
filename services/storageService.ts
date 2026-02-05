import { Game, Idea, AppProject, LearningItem } from '../types';

// Helper to get user-specific storage keys
const getGamesKey = (username: string) => `serguiales_games_${username}`;
const getIdeasKey = (username: string) => `serguiales_ideas_${username}`;
const getAppsKey = (username: string) => `serguiales_apps_${username}`;
const getLearnKey = (username: string) => `serguiales_learn_${username}`;

// Games
export const loadGames = (username: string): Game[] => {
  try {
    const data = localStorage.getItem(getGamesKey(username));
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error loading games", e);
    return [];
  }
};

export const saveGames = (username: string, games: Game[]) => {
  try {
    localStorage.setItem(getGamesKey(username), JSON.stringify(games));
  } catch (e) {
    console.error("Error saving games", e);
  }
};

// Ideas
export const loadIdeas = (username: string): Idea[] => {
  try {
    const data = localStorage.getItem(getIdeasKey(username));
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error loading ideas", e);
    return [];
  }
};

export const saveIdeas = (username: string, ideas: Idea[]) => {
  try {
    localStorage.setItem(getIdeasKey(username), JSON.stringify(ideas));
  } catch (e) {
    console.error("Error saving ideas", e);
  }
};

// Apps
export const loadApps = (username: string): AppProject[] => {
  try {
    const data = localStorage.getItem(getAppsKey(username));
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error loading apps", e);
    return [];
  }
};

export const saveApps = (username: string, apps: AppProject[]) => {
  try {
    localStorage.setItem(getAppsKey(username), JSON.stringify(apps));
  } catch (e) {
    console.error("Error saving apps", e);
  }
};

// Learning
export const loadLearning = (username: string): LearningItem[] => {
  try {
    const data = localStorage.getItem(getLearnKey(username));
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error loading learning items", e);
    return [];
  }
};

export const saveLearning = (username: string, items: LearningItem[]) => {
  try {
    localStorage.setItem(getLearnKey(username), JSON.stringify(items));
  } catch (e) {
    console.error("Error saving learning items", e);
  }
};