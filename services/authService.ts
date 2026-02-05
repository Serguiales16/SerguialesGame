import { User } from '../types';

const USERS_STORAGE_KEY = 'serguiales_users';
const CURRENT_USER_KEY = 'serguiales_current_user';

// Get all users from localStorage
const getUsers = (): User[] => {
    try {
        const data = localStorage.getItem(USERS_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Error loading users", e);
        return [];
    }
};

// Save users to localStorage
const saveUsers = (users: User[]) => {
    try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
        console.error("Error saving users", e);
    }
};

// Register a new user
export const register = (username: string, password: string): { success: boolean; message: string } => {
    if (!username.trim() || !password.trim()) {
        return { success: false, message: 'Usuario y contraseña son requeridos' };
    }

    if (username.length < 3) {
        return { success: false, message: 'El usuario debe tener al menos 3 caracteres' };
    }

    if (password.length < 4) {
        return { success: false, message: 'La contraseña debe tener al menos 4 caracteres' };
    }

    const users = getUsers();

    // Check if user already exists
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, message: 'El usuario ya existe' };
    }

    // Create new user
    const newUser: User = {
        username: username.trim(),
        password: password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    return { success: true, message: 'Usuario registrado exitosamente' };
};

// Login user
export const login = (username: string, password: string): { success: boolean; message: string } => {
    if (!username.trim() || !password.trim()) {
        return { success: false, message: 'Usuario y contraseña son requeridos' };
    }

    const users = getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

    if (!user) {
        return { success: false, message: 'Usuario o contraseña incorrectos' };
    }

    // Save current user
    localStorage.setItem(CURRENT_USER_KEY, user.username);

    return { success: true, message: 'Login exitoso' };
};

// Logout user
export const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

// Get current logged in user
export const getCurrentUser = (): string | null => {
    return localStorage.getItem(CURRENT_USER_KEY);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return getCurrentUser() !== null;
};
