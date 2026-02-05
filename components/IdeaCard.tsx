import React from 'react';
import { Idea } from '../types';
import { Lightbulb, Calendar, Tag, Trash2, Sparkles } from 'lucide-react';

interface IdeaCardProps {
  idea: Idea;
  onDelete: (id: string) => void;
  onClick: (idea: Idea) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onDelete, onClick }) => {
  const date = new Date(idea.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  });

  return (
    <div
      onClick={() => onClick(idea)}
      className="group relative bg-gradient-to-br from-gray-800 via-gray-800 to-blue-900/10 border border-gray-700 rounded-2xl p-6 hover:border-blue-500 hover:shadow-[0_8px_30px_rgba(59,130,246,0.25)] transition-all duration-300 overflow-hidden cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
    >

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:left-full transition-all duration-700" />
      </div>

      {/* Background Decor */}
      <div className="absolute -top-6 -right-6 p-6 opacity-[0.04] group-hover:opacity-[0.12] transition-all duration-500 text-blue-400 rotate-12 group-hover:rotate-6 group-hover:scale-110">
        <Lightbulb size={120} />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors pr-4 flex-1">
            {idea.title}
          </h3>
          {idea.priority === 'high' && (
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] group-hover:shadow-[0_0_16px_rgba(239,68,68,1)] shrink-0 mt-1.5 transition-all" />
          )}
          {idea.priority === 'medium' && (
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.8)] group-hover:shadow-[0_0_16px_rgba(234,179,8,1)] shrink-0 mt-1.5 transition-all" />
          )}
          {idea.priority === 'low' && (
            <span className="w-2.5 h-2.5 rounded-full bg-gray-500 shadow-[0_0_8px_rgba(107,114,128,0.6)] shrink-0 mt-1.5" />
          )}
        </div>

        <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow group-hover:text-gray-300 transition-colors">
          {idea.description || 'Sin descripción'}
        </p>

        <div className="space-y-4 mt-auto">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {idea.tags.length > 0 ? (
              idea.tags.slice(0, 3).map(tag => (
                <span key={tag} className="flex items-center gap-1 text-[10px] uppercase font-bold text-blue-300 bg-blue-900/30 border border-blue-500/30 px-2 py-1 rounded-md group-hover:bg-blue-900/50 group-hover:border-blue-500/50 transition-all">
                  <Sparkles size={10} /> {tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-600 italic">Sin tags</span>
            )}
            {idea.tags.length > 3 && (
              <span className="text-xs text-blue-400 font-bold">+{idea.tags.length - 3}</span>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-700 group-hover:border-gray-600 text-xs text-gray-500 transition-colors">
            <span className="flex items-center gap-1.5 group-hover:text-blue-400 transition-colors">
              <Calendar size={12} /> {date}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(idea.id); }}
              className="text-gray-600 hover:text-red-400 transition-colors p-1 hover:scale-110 active:scale-95"
              title="Eliminar idea"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};