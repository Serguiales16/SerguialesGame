import React, { useState } from 'react';
import { Game } from '../types';
import { generateResume, planSession, analyzeStagnation } from '../services/geminiService';
import { BrainCircuit, Play, AlertCircle, Loader2, Sparkles } from 'lucide-react';

interface AIHubProps {
  game: Game;
}

export const AIHub: React.FC<AIHubProps> = ({ game }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<{ title: string; content: string; type: 'resume' | 'plan' | 'stagnation' } | null>(null);
  const [timeInput, setTimeInput] = useState<string>('60');

  const handleResume = async () => {
    setLoading('resume');
    const text = await generateResume(game);
    setResult({ title: '¿Dónde lo dejé?', content: text, type: 'resume' });
    setLoading(null);
  };

  const handlePlan = async () => {
    setLoading('plan');
    const text = await planSession(game, parseInt(timeInput));
    setResult({ title: 'Plan de Sesión', content: text, type: 'plan' });
    setLoading(null);
  };

  const handleStagnation = async () => {
    setLoading('stagnation');
    const text = await analyzeStagnation(game);
    setResult({ title: 'Análisis de Progreso', content: text, type: 'stagnation' });
    setLoading(null);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mb-10 shadow-lg relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary-900 to-primary-800 blur-3xl rounded-full pointer-events-none opacity-20"></div>

      <div className="flex items-center gap-2 mb-6 relative z-10">
        <div className="p-1.5 bg-gray-900 border border-gray-700 text-primary-500 rounded-lg">
             <Sparkles size={20} />
        </div>
        <div>
            <h2 className="text-lg font-bold text-white leading-none">AI Assistant</h2>
            <p className="text-xs text-gray-400">Powered by Gemini</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative z-10">
        {/* Resume Button */}
        <button
          onClick={handleResume}
          disabled={!!loading}
          className="flex flex-col items-center justify-center p-4 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-primary-500 hover:shadow-[0_0_10px_rgba(220,38,38,0.2)] rounded-xl transition-all group"
        >
          <BrainCircuit className="mb-2 text-primary-500 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold text-gray-300 group-hover:text-white">¿Dónde lo dejé?</span>
          <span className="text-xs text-gray-500 mt-1">Resumen sin spoilers</span>
        </button>

        {/* Plan Session */}
        <div className="flex flex-col gap-2 bg-gray-900 border border-gray-700 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                <span>Tiempo disponible</span>
                <select 
                    value={timeInput} 
                    onChange={(e) => setTimeInput(e.target.value)}
                    className="bg-gray-800 border border-gray-600 rounded px-1 text-white focus:outline-none focus:border-primary-500 py-0.5"
                >
                    <option value="30">30 min</option>
                    <option value="60">1h</option>
                    <option value="120">2h</option>
                    <option value="180">3h+</option>
                </select>
            </div>
            <button
                onClick={handlePlan}
                disabled={!!loading}
                className="flex items-center justify-center gap-2 w-full py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-primary-900/30 active:scale-95"
            >
                {loading === 'plan' ? <Loader2 className="animate-spin" size={14}/> : <Play size={14} fill="currentColor" />}
                Planificar
            </button>
        </div>

        {/* Stagnation Check */}
        <button
          onClick={handleStagnation}
          disabled={!!loading}
          className="flex flex-col items-center justify-center p-4 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-yellow-500 hover:shadow-md rounded-xl transition-all group"
        >
          <AlertCircle className="mb-2 text-yellow-500 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold text-gray-300 group-hover:text-white">Análisis</span>
          <span className="text-xs text-gray-500 mt-1">Detectar atascos</span>
        </button>
      </div>

      {loading === 'resume' || loading === 'stagnation' ? (
          <div className="flex items-center justify-center py-8 text-primary-400 font-medium bg-gray-900/50 rounded-lg">
              <Loader2 className="animate-spin mr-2" /> Consultando a la IA...
          </div>
      ) : null}

      {result && !loading && (
        <div className={`mt-4 p-6 rounded-xl border animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-sm
            ${result.type === 'resume' ? 'bg-primary-900/10 border-primary-500/20' : 
              result.type === 'plan' ? 'bg-blue-900/10 border-blue-500/20' : 
              'bg-yellow-900/10 border-yellow-500/20'}`
        }>
            <h3 className={`text-md font-bold mb-3 flex items-center gap-2 
                ${result.type === 'resume' ? 'text-primary-400' : result.type === 'plan' ? 'text-blue-400' : 'text-yellow-400'}`}>
                {result.type === 'resume' && <BrainCircuit size={18} />}
                {result.title}
            </h3>
            <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-line leading-relaxed">
                {result.content}
            </div>
        </div>
      )}
    </div>
  );
};