import { Game, Idea, AppProject, LearningItem } from '../types';

const GAMES_STORAGE_KEY = 'serguiales_games_v1';
const IDEAS_STORAGE_KEY = 'serguiales_ideas_v1';
const APPS_STORAGE_KEY = 'serguiales_apps_v1';
const LEARN_STORAGE_KEY = 'serguiales_learn_v1';

// Games
export const loadGames = (): Game[] => {
  try {
    const data = localStorage.getItem(GAMES_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error loading games", e);
    return [];
  }
};

export const saveGames = (games: Game[]) => {
  try {
    localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(games));
  } catch (e) {
    console.error("Error saving games", e);
  }
};

// Ideas
export const loadIdeas = (): Idea[] => {
  try {
    const data = localStorage.getItem(IDEAS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error loading ideas", e);
    return [];
  }
};

export const saveIdeas = (ideas: Idea[]) => {
  try {
    localStorage.setItem(IDEAS_STORAGE_KEY, JSON.stringify(ideas));
  } catch (e) {
    console.error("Error saving ideas", e);
  }
};

// Apps
export const loadApps = (): AppProject[] => {
  try {
    const data = localStorage.getItem(APPS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error loading apps", e);
    return [];
  }
};

export const saveApps = (apps: AppProject[]) => {
  try {
    localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(apps));
  } catch (e) {
    console.error("Error saving apps", e);
  }
};

// Learning
export const loadLearning = (): LearningItem[] => {
  try {
    const data = localStorage.getItem(LEARN_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error loading learning items", e);
    return [];
  }
};

export const saveLearning = (items: LearningItem[]) => {
  try {
    localStorage.setItem(LEARN_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Error saving learning items", e);
  }
};