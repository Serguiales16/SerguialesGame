import { supabase } from '../lib/supabase';
import { User } from '../types';

// Register a new user with Supabase Auth
export const register = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    if (!username.trim() || !password.trim()) {
        return { success: false, message: 'Usuario y contraseña son requeridos' };
    }

    if (username.length < 3) {
        return { success: false, message: 'El usuario debe tener al menos 3 caracteres' };
    }

    if (password.length < 6) {
        return { success: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }

    try {
        // Check if input is already an email or just a username
        const isEmail = username.includes('@');
        const email = isEmail ? username.toLowerCase() : `${username.toLowerCase()}@serguiales.local`;
        const displayName = isEmail ? username.split('@')[0] : username.trim();

        // Sign up with Supabase
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: displayName
                }
            }
        });

        if (error) {
            // Check if user already exists
            if (error.message.includes('already registered') || error.message.includes('already been registered')) {
                return { success: false, message: 'El usuario ya existe' };
            }
            if (error.message.includes('Invalid email')) {
                return { success: false, message: 'Email inválido. Usa un email real o solo un nombre de usuario.' };
            }
            return { success: false, message: error.message };
        }

        if (!data.user) {
            return { success: false, message: 'Error al crear usuario' };
        }

        return { success: true, message: 'Usuario registrado exitosamente' };
    } catch (e) {
        console.error('Error en registro:', e);
        return { success: false, message: 'Error al registrar usuario' };
    }
};

// Login with existing user
export const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    if (!username.trim() || !password.trim()) {
        return { success: false, message: 'Usuario y contraseña son requeridos' };
    }

    try {
        // Check if input is already an email or just a username
        const isEmail = username.includes('@');
        const email = isEmail ? username.toLowerCase() : `${username.toLowerCase()}@serguiales.local`;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            if (error.message.includes('Invalid login credentials')) {
                return { success: false, message: 'Usuario o contraseña incorrectos' };
            }
            return { success: false, message: error.message };
        }

        if (!data.user) {
            return { success: false, message: 'Error al iniciar sesión' };
        }

        return { success: true, message: 'Sesión iniciada correctamente' };
    } catch (e) {
        console.error('Error en login:', e);
        return { success: false, message: 'Error al iniciar sesión' };
    }
};

// Logout user
export const logout = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error al cerrar sesión:', error);
        }
    } catch (e) {
        console.error('Error en logout:', e);
    }
};

// Get current logged in user
export const getCurrentUser = async (): Promise<string | null> => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            // Return username from metadata
            return session.user.user_metadata?.username || session.user.email?.split('@')[0] || null;
        }
        return null;
    } catch (e) {
        console.error('Error getting current user:', e);
        return null;
    }
};

// Get current user ID (UUID)
export const getCurrentUserId = async (): Promise<string | null> => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.user?.id || null;
    } catch (e) {
        console.error('Error getting user ID:', e);
        return null;
    }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        return session !== null;
    } catch (e) {
        console.error('Error checking authentication:', e);
        return false;
    }
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: string | null) => void) => {
    return supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
            const username = session.user.user_metadata?.username || session.user.email?.split('@')[0] || null;
            callback(username);
        } else {
            callback(null);
        }
    });
};

