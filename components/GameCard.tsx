import React from 'react';
import { Game, GameStatus } from '../types';
import { Trophy, Clock, Gamepad2 } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onClick: (game: Game) => void;
}

const statusColor = (status: GameStatus) => {
  switch (status) {
    case GameStatus.PLAYING: return 'text-green-400 border-green-900 bg-green-900/20';
    case GameStatus.COMPLETED: return 'text-yellow-400 border-yellow-900 bg-yellow-900/20';
    case GameStatus.ABANDONED: return 'text-red-400 border-red-900 bg-red-900/20';
    case GameStatus.PAUSED: return 'text-gray-400 border-gray-700 bg-gray-800';
    default: return 'text-gray-500 bg-gray-800';
  }
};

export const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  const lastPlayedDate = game.lastPlayed ? new Date(game.lastPlayed).toLocaleDateString() : 'Nunca';
  const totalHours = Math.round(game.sessions.reduce((acc, curr) => acc + curr.durationMinutes, 0) / 60);

  return (
    <div 
      onClick={() => onClick(game)}
      className="group relative bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-primary-500 transition-all duration-300 cursor-pointer overflow-hidden shadow-lg hover:shadow-primary-900/20"
    >
      <div className="absolute -top-6 -right-6 p-6 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity text-white rotate-12">
        <Gamepad2 size={120} />
      </div>

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors truncate max-w-[200px]">
            {game.title}
          </h3>
          <p className="text-sm text-gray-400 flex items-center gap-1">
            <span className="bg-gray-900 border border-gray-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-gray-500">{game.platform}</span>
          </p>
        </div>
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${statusColor(game.status)}`}>
          {game.status}
        </span>
      </div>

      <div className="relative z-10 space-y-5">
        {/* Progress Bar */}
        <div>
            <div className="flex justify-between text-xs font-medium text-gray-500 mb-1.5">
                <span>Progreso</span>
                <span className="text-gray-300">{game.completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-900 h-2.5 rounded-full overflow-hidden border border-gray-700">
                <div 
                    className="h-full bg-gradient-to-r from-primary-600 to-primary-500 transition-all duration-1000 shadow-[0_0_12px_rgba(239,68,68,0.5)]" 
                    style={{ width: `${game.completionPercentage}%` }}
                />
            </div>
        </div>

        <div className="flex items-center gap-5 text-sm text-gray-400 pt-2 border-t border-gray-700">
            <div className="flex items-center gap-1.5">
                <Clock size={15} className="text-primary-500" />
                <span className="font-medium">{totalHours}h</span>
            </div>
             <div className="flex items-center gap-1.5">
                <Trophy size={15} className="text-yellow-500" />
                <span className="font-medium">{lastPlayedDate}</span>
            </div>
        </div>
      </div>
    </div>
  );
};