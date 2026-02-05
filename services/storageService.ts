import { supabase } from '../lib/supabase';
import { Game, Idea, AppProject, LearningItem } from '../types';
import { getCurrentUserId } from './authService';

// ============================================
// GAMES
// ============================================

export const loadGames = async (): Promise<Game[]> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading games:', error);
      return [];
    }

    // Transform database format to app format
    return (data || []).map(game => ({
      id: game.id,
      title: game.title,
      platform: game.platform,
      status: game.status as any,
      completionPercentage: game.completion_percentage,
      coverUrl: game.cover_url || undefined,
      sessions: game.sessions as any,
      lastPlayed: game.last_played || undefined,
      notes: game.notes
    }));
  } catch (e) {
    console.error('Error loading games:', e);
    return [];
  }
};

export const saveGame = async (game: Game): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from('games')
      .upsert({
        id: game.id,
        user_id: userId,
        title: game.title,
        platform: game.platform,
        status: game.status,
        completion_percentage: game.completionPercentage,
        cover_url: game.coverUrl,
        sessions: game.sessions,
        last_played: game.lastPlayed,
        notes: game.notes
      });

    if (error) {
      console.error('Error saving game:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Error saving game:', e);
    return false;
  }
};

export const deleteGame = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting game:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Error deleting game:', e);
    return false;
  }
};

// ============================================
// IDEAS
// ============================================

export const loadIdeas = async (): Promise<Idea[]> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading ideas:', error);
      return [];
    }

    // Transform database format to app format
    return (data || []).map(idea => ({
      id: idea.id,
      title: idea.title,
      description: idea.description,
      tags: idea.tags,
      priority: idea.priority as any,
      createdAt: idea.created_at
    }));
  } catch (e) {
    console.error('Error loading ideas:', e);
    return [];
  }
};

export const saveIdea = async (idea: Idea): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from('ideas')
      .upsert({
        id: idea.id,
        user_id: userId,
        title: idea.title,
        description: idea.description,
        tags: idea.tags,
        priority: idea.priority,
        created_at: idea.createdAt
      });

    if (error) {
      console.error('Error saving idea:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Error saving idea:', e);
    return false;
  }
};

export const deleteIdea = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('ideas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting idea:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Error deleting idea:', e);
    return false;
  }
};

// ============================================
// APPS
// ============================================

export const loadApps = async (): Promise<AppProject[]> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading apps:', error);
      return [];
    }

    // Transform database format to app format
    return (data || []).map(app => ({
      id: app.id,
      name: app.name,
      description: app.description,
      url: app.url || undefined,
      techStack: app.tech_stack,
      status: app.status as any
    }));
  } catch (e) {
    console.error('Error loading apps:', e);
    return [];
  }
};

export const saveApp = async (app: AppProject): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from('apps')
      .upsert({
        id: app.id,
        user_id: userId,
        name: app.name,
        description: app.description,
        url: app.url,
        tech_stack: app.techStack,
        status: app.status
      });

    if (error) {
      console.error('Error saving app:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Error saving app:', e);
    return false;
  }
};

export const deleteApp = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('apps')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting app:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Error deleting app:', e);
    return false;
  }
};

// ============================================
// LEARNING ITEMS
// ============================================

export const loadLearning = async (): Promise<LearningItem[]> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from('learning_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading learning items:', error);
      return [];
    }

    // Transform database format to app format
    return (data || []).map(item => ({
      id: item.id,
      topic: item.topic,
      category: item.category,
      status: item.status as any,
      notes: item.notes || undefined
    }));
  } catch (e) {
    console.error('Error loading learning items:', e);
    return [];
  }
};

export const saveLearning = async (item: LearningItem): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from('learning_items')
      .upsert({
        id: item.id,
        user_id: userId,
        topic: item.topic,
        category: item.category,
        status: item.status,
        notes: item.notes
      });

    if (error) {
      console.error('Error saving learning item:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Error saving learning item:', e);
    return false;
  }
};

export const deleteLearning = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('learning_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting learning item:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Error deleting learning item:', e);
    return false;
  }
};
