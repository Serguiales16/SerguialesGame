import React, { useState } from 'react';
import { Game, Session, GameStatus } from '../types';
import { ArrowLeft, Calendar, Clock, Plus, Trash2 } from 'lucide-react';
import { AIHub } from './AIHub';

interface GameDetailViewProps {
  game: Game;
  onBack: () => void;
  onUpdateGame: (updatedGame: Game) => void;
  onDeleteGame: (gameId: string) => void;
}

export const GameDetailView: React.FC<GameDetailViewProps> = ({ game, onBack, onUpdateGame, onDeleteGame }) => {
  const [showAddSession, setShowAddSession] = useState(false);
  const [newSessionNotes, setNewSessionNotes] = useState('');
  const [newSessionDuration, setNewSessionDuration] = useState(60);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateGame({ ...game, status: e.target.value as GameStatus });
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateGame({ ...game, completionPercentage: parseInt(e.target.value) });
  };

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    const session: Session = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      durationMinutes: newSessionDuration,
      notes: newSessionNotes
    };
    
    const updatedGame = {
      ...game,
      lastPlayed: new Date().toISOString(),
      sessions: [...game.sessions, session]
    };

    onUpdateGame(updatedGame);
    setShowAddSession(false);
    setNewSessionNotes('');
    setNewSessionDuration(60);
  };

  const handleDeleteSession = (sessionId: string) => {
      const updatedGame = {
          ...game,
          sessions: game.sessions.filter(s => s.id !== sessionId)
      };
      onUpdateGame(updatedGame);
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-right-8 duration-300">
      {/* Header Navigation */}
      <button 
        onClick={onBack} 
        className="flex items-center text-gray-500 hover:text-white mb-6 transition-colors font-medium group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Volver al Dashboard
      </button>

      {/* Main Game Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">{game.title}</h1>
          <div className="flex items-center gap-3">
             <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-md text-sm font-bold border border-gray-700">{game.platform}</span>
             <select 
                value={game.status} 
                onChange={handleStatusChange}
                className="bg-gray-800 border border-gray-700 text-gray-300 text-sm font-medium rounded-md px-3 py-1 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none shadow-sm cursor-pointer"
             >
                 {Object.values(GameStatus).map(s => <option key={s} value={s}>{s}</option>)}
             </select>
          </div>
        </div>
        
        <div className="w-full md:w-64 p-4 bg-gray-800 rounded-xl border border-gray-700 shadow-sm">
            <div className="flex justify-between text-sm font-bold text-gray-400 mb-2">
                <span>Progreso General</span>
                <span className="text-primary-400 font-mono">{game.completionPercentage}%</span>
            </div>
            <input 
                type="range" 
                min="0" 
                max="100" 
                value={game.completionPercentage} 
                onChange={handleProgressChange}
                className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
        </div>
      </div>

      {/* AI Assistant Section */}
      <AIHub game={game} />

      {/* Sessions & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Add Session */}
        <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg sticky top-24">
                <h3 className="text-lg font-bold text-white mb-5">Nueva Sesión</h3>
                
                {!showAddSession ? (
                    <button 
                        onClick={() => setShowAddSession(true)}
                        className="w-full py-4 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-all flex items-center justify-center gap-2 font-medium bg-gray-900 hover:bg-gray-800"
                    >
                        <Plus size={20} /> Registrar Juego
                    </button>
                ) : (
                    <form onSubmit={handleAddSession} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Duración (min)</label>
                            <input 
                                type="number" 
                                value={newSessionDuration}
                                onChange={(e) => setNewSessionDuration(Number(e.target.value))}
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-all placeholder-gray-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Notas de la sesión</label>
                            <textarea 
                                value={newSessionNotes}
                                onChange={(e) => setNewSessionNotes(e.target.value)}
                                placeholder="Derroté al jefe X, encontré la llave Y..."
                                className="w-full h-32 bg-gray-900 border border-gray-600 rounded-lg p-3 text-white text-sm focus:border-primary-500 outline-none resize-none transition-all placeholder-gray-500"
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <button type="button" onClick={() => setShowAddSession(false)} className="flex-1 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 text-sm font-medium transition-colors">Cancelar</button>
                            <button type="submit" className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 text-sm font-bold shadow-lg shadow-primary-900/30 transition-all">Guardar</button>
                        </div>
                    </form>
                )}

                 <div className="mt-8 pt-6 border-t border-gray-700">
                    <button 
                        onClick={() => {
                            if(window.confirm('¿Seguro que quieres eliminar este juego y todos sus datos?')) {
                                onDeleteGame(game.id);
                            }
                        }}
                        className="text-xs font-bold text-red-500 hover:text-red-400 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-red-900/20 w-fit"
                    >
                        <Trash2 size={14} /> ELIMINAR JUEGO
                    </button>
                </div>
            </div>
        </div>

        {/* Right Col: Timeline */}
        <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Calendar size={20} className="text-primary-500"/>
                Historial de Sesiones
            </h3>

            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gray-700">
                {game.sessions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-gray-800 rounded-xl border border-gray-700 border-dashed">
                        No hay sesiones registradas aún. ¡Empieza a jugar!
                    </div>
                ) : (
                    [...game.sessions].reverse().map((session) => (
                        <div key={session.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            
                            {/* Dot on Timeline */}
                            <div className="absolute left-0 w-10 h-10 border-4 border-gray-800 bg-gray-700 rounded-full flex items-center justify-center shadow-md md:left-1/2 md:-translate-x-1/2 z-10 group-hover:bg-primary-600 group-hover:ring-4 group-hover:ring-primary-900/50 transition-all duration-300">
                                <div className="w-2 h-2 bg-gray-400 rounded-full group-hover:bg-white transition-colors"></div>
                            </div>

                            {/* Card */}
                            <div className="ml-12 md:ml-0 md:w-[45%] bg-gray-800 border border-gray-700 p-5 rounded-2xl shadow-lg hover:border-primary-900 transition-all">
                                <div className="flex justify-between items-start mb-3 border-b border-gray-700 pb-2">
                                    <span className="text-xs font-bold text-primary-400 bg-primary-900/20 px-2 py-0.5 rounded">
                                        {new Date(session.date).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                                        <Clock size={12} /> {session.durationMinutes}m
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                                    {session.notes}
                                </p>
                                <button 
                                    onClick={() => handleDeleteSession(session.id)}
                                    className="mt-4 text-[10px] font-bold text-gray-500 hover:text-red-400 flex items-center gap-1 uppercase tracking-wide transition-colors"
                                >
                                    <Trash2 size={12} /> borrar entrada
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
};