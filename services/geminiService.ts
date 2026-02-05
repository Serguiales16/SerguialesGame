import { GoogleGenAI } from "@google/genai";
import { Game, Session } from "../types";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Helper to format sessions for context
const formatSessionsForContext = (sessions: Session[]): string => {
  // Take last 5 sessions for relevance
  const recentSessions = sessions.slice(-5).reverse(); 
  if (recentSessions.length === 0) return "No hay sesiones registradas.";
  
  return recentSessions.map(s => 
    `- Fecha: ${new Date(s.date).toLocaleDateString()}\n  Notas: ${s.notes}`
  ).join('\n');
};

export const generateResume = async (game: Game): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Configura tu API Key para usar la IA.";

  const sessionContext = formatSessionsForContext(game.sessions);
  
  const prompt = `
    Actúa como un asistente de memoria para un jugador de videojuegos.
    Juego: ${game.title}
    Plataforma: ${game.platform}
    Estado actual: ${game.status}
    
    Historial de sesiones recientes (basado en notas del usuario):
    ${sessionContext}

    TAREA:
    Genera un resumen "Anteriormente en..." breve, narrativo y ÉPICO.
    Explica dónde lo dejó el jugador y cuál parece ser el siguiente paso lógico basado SOLO en sus notas.
    
    REGLAS ESTRICTAS:
    - NO inventes historia que no esté en las notas.
    - NO uses spoilers externos ni busques en internet.
    - Si las notas son vagas, haz un resumen general y motivador.
    - Mantén un tono "Gamer", serio pero alentador.
    - Máximo 3 parrafos cortos.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No se pudo generar un resumen.";
  } catch (error) {
    console.error(error);
    return "Error al conectar con la IA.";
  }
};

export const planSession = async (game: Game, timeAvailable: number): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Configura tu API Key.";

  const sessionContext = formatSessionsForContext(game.sessions);

  const prompt = `
    Eres un estratega de videojuegos.
    Juego: ${game.title}
    Tiempo disponible hoy: ${timeAvailable} minutos.
    
    Notas recientes:
    ${sessionContext}

    TAREA:
    Sugiere un objetivo claro y alcanzable para esta sesión de ${timeAvailable} minutos.
    Considera si el jugador estaba atascado o progresando rápido.
    
    Salida deseada:
    1. Objetivo Principal.
    2. Consejo rápido.
    Todo en menos de 100 palabras.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No se pudo generar el plan.";
  } catch (error) {
    console.error(error);
    return "Error al planificar sesión.";
  }
};

export const analyzeStagnation = async (game: Game): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "";

  // Logic: Only run if paused or abandoned or playing with low progress updates
  const prompt = `
    Analiza la situación de este jugador.
    Juego: ${game.title}
    Estado: ${game.status}
    Última vez jugado: ${game.lastPlayed ? new Date(game.lastPlayed).toLocaleDateString() : 'Nunca'}
    Progreso: ${game.completionPercentage}%
    
    Notas recientes:
    ${formatSessionsForContext(game.sessions)}

    TAREA:
    Si detectas estancamiento o frustración en las notas, sugiere amablemente una estrategia (tomar un descanso, buscar guía sin spoilers, cambiar de misión). Si parece ir bien, solo da un mensaje de ánimo corto.
    Sé muy breve (máx 2 frases).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    return "";
  }
};
