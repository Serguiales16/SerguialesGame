import React from 'react';
import { LearningItem } from '../types';
import { BookOpen, CheckCircle2, CircleDashed, Trash2, Library } from 'lucide-react';

interface LearningCardProps {
  item: LearningItem;
  onDelete: (id: string) => void;
}

export const LearningCard: React.FC<LearningCardProps> = ({ item, onDelete }) => {
  return (
    <div className="group relative bg-gray-800 border border-gray-700 rounded-2xl p-5 hover:border-emerald-500 transition-all duration-300 shadow-sm hover:shadow-emerald-900/20">
        
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">{item.category}</span>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                {item.topic}
            </h3>
            {item.notes && (
                <p className="text-gray-400 text-xs line-clamp-2">{item.notes}</p>
            )}
        </div>
        
        <div className="flex flex-col items-end gap-2">
            {item.status === 'Mastered' ? (
                <CheckCircle2 className="text-emerald-500" size={20} />
            ) : item.status === 'Learning' ? (
                <Library className="text-yellow-500 animate-pulse" size={20} />
            ) : (
                <CircleDashed className="text-gray-600" size={20} />
            )}
            
            <button 
                onClick={() => onDelete(item.id)}
                className="text-gray-700 hover:text-red-400 transition-colors mt-2"
            >
                <Trash2 size={14} />
            </button>
        </div>
      </div>

      {/* Progress Indicator (Visual only based on status) */}
      <div className="w-full bg-gray-900 h-1 mt-4 rounded-full overflow-hidden">
        <div 
            className={`h-full transition-all duration-500 ${
                item.status === 'Mastered' ? 'w-full bg-emerald-500' : 
                item.status === 'Learning' ? 'w-1/2 bg-yellow-500' : 'w-0 bg-gray-700'
            }`}
        />
      </div>
    </div>
  );
};