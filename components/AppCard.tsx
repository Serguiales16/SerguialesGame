import React from 'react';
import { AppProject } from '../types';
import { Rocket, ExternalLink, Trash2, Code2 } from 'lucide-react';

interface AppCardProps {
  app: AppProject;
  onDelete: (id: string) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onDelete }) => {
  return (
    <div className="group relative bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-purple-500 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-purple-900/20">
      
      {/* Background Decor */}
      <div className="absolute -top-6 -right-6 p-6 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity text-purple-400 rotate-12">
        <Rocket size={120} />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors truncate">
                {app.name}
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide
                ${app.status === 'Live' ? 'text-green-400 border-green-900 bg-green-900/20' : 
                  app.status === 'Development' ? 'text-yellow-400 border-yellow-900 bg-yellow-900/20' : 
                  'text-gray-400 border-gray-700'}`}>
                {app.status}
            </span>
        </div>

        <p className="text-gray-400 text-sm mb-6 leading-relaxed flex-grow">
          {app.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
            {app.techStack.map(tech => (
                <span key={tech} className="text-[10px] font-mono text-purple-300 bg-purple-900/30 border border-purple-500/30 px-2 py-1 rounded">
                    {tech}
                </span>
            ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-700 mt-auto">
            {app.url ? (
                <a 
                    href={app.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-bold text-white hover:text-purple-400 transition-colors"
                >
                    <ExternalLink size={14} /> Abrir App
                </a>
            ) : (
                <span className="text-xs text-gray-500 italic">Sin URL pública</span>
            )}
            
            <button 
                onClick={(e) => { e.stopPropagation(); onDelete(app.id); }}
                className="text-gray-600 hover:text-red-400 transition-colors p-1"
            >
                <Trash2 size={14} />
            </button>
        </div>
      </div>
    </div>
  );
};