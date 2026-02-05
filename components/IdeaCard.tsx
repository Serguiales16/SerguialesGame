import React from 'react';
import { Idea } from '../types';
import { Lightbulb, Calendar, Tag, Trash2 } from 'lucide-react';

interface IdeaCardProps {
  idea: Idea;
  onDelete: (id: string) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onDelete }) => {
  const date = new Date(idea.createdAt).toLocaleDateString();

  return (
    <div className="group relative bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-blue-900/20">
      
      {/* Background Decor */}
      <div className="absolute -top-6 -right-6 p-6 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity text-blue-400 rotate-12">
        <Lightbulb size={120} />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors truncate w-full pr-4">
            {idea.title}
            </h3>
            {idea.priority === 'high' && <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] shrink-0 mt-2"></span>}
            {idea.priority === 'medium' && <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)] shrink-0 mt-2"></span>}
        </div>

        <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
          {idea.description}
        </p>

        <div className="space-y-4 mt-auto">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
                {idea.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 text-[10px] uppercase font-bold text-blue-300 bg-blue-900/30 border border-blue-500/30 px-2 py-1 rounded-md">
                        <Tag size={10} /> {tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-700 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                    <Calendar size={12} /> {date}
                </span>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(idea.id); }}
                    className="text-gray-600 hover:text-red-400 transition-colors p-1"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};