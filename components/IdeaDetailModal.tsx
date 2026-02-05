import React, { useState, useEffect } from 'react';
import { Idea } from '../types';
import { X, Lightbulb, Calendar, Tag, Edit2, Save, Trash2, Sparkles } from 'lucide-react';

interface IdeaDetailModalProps {
    idea: Idea;
    onClose: () => void;
    onUpdate: (updatedIdea: Idea) => void;
    onDelete: (id: string) => void;
}

export const IdeaDetailModal: React.FC<IdeaDetailModalProps> = ({ idea, onClose, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(idea.title);
    const [description, setDescription] = useState(idea.description);
    const [tags, setTags] = useState(idea.tags.join(', '));
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(idea.priority);

    const date = new Date(idea.createdAt).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Close modal on ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSave = () => {
        const updatedIdea: Idea = {
            ...idea,
            title: title.trim(),
            description: description.trim(),
            tags: tags.split(',').map(t => t.trim()).filter(t => t.length > 0),
            priority
        };
        onUpdate(updatedIdea);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta idea?')) {
            onDelete(idea.id);
            onClose();
        }
    };

    const handleCancel = () => {
        setTitle(idea.title);
        setDescription(idea.description);
        setTags(idea.tags.join(', '));
        setPriority(idea.priority);
        setIsEditing(false);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative bg-gradient-to-br from-gray-800 via-gray-800 to-blue-900/20 border border-blue-500/30 rounded-3xl shadow-[0_20px_60px_rgba(59,130,246,0.3)] max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-blue-500/10 to-transparent rounded-t-3xl pointer-events-none" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 p-2 bg-gray-900/50 hover:bg-gray-900 border border-gray-700 hover:border-blue-500 rounded-lg text-gray-400 hover:text-white transition-all"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="relative p-8">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-xl">
                            <Lightbulb size={32} className="text-blue-400" />
                        </div>
                        <div className="flex-1">
                            {isEditing ? (
                                <input
                                    autoFocus
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full text-2xl font-bold text-white bg-gray-900/50 border border-blue-500/50 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    placeholder="Título de la idea"
                                />
                            ) : (
                                <h2 className="text-3xl font-bold text-white mb-2">{idea.title}</h2>
                            )}
                            <div className="flex items-center gap-3 mt-2">
                                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                                    <Calendar size={14} />
                                    {date}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Priority Indicator */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">
                            Prioridad
                        </label>
                        {isEditing ? (
                            <div className="flex gap-3">
                                {(['low', 'medium', 'high'] as const).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPriority(p)}
                                        className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all border-2 ${priority === p
                                                ? p === 'high'
                                                    ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                                                    : p === 'medium'
                                                        ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)]'
                                                        : 'bg-gray-500/20 border-gray-500 text-gray-400'
                                                : 'bg-gray-800/50 border-gray-700 text-gray-500 hover:border-gray-600'
                                            }`}
                                    >
                                        {p === 'high' ? 'Alta' : p === 'medium' ? 'Media' : 'Baja'}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                {priority === 'high' && (
                                    <>
                                        <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
                                        <span className="text-red-400 font-bold">Alta</span>
                                    </>
                                )}
                                {priority === 'medium' && (
                                    <>
                                        <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.8)]" />
                                        <span className="text-yellow-400 font-bold">Media</span>
                                    </>
                                )}
                                {priority === 'low' && (
                                    <>
                                        <span className="w-3 h-3 rounded-full bg-gray-500" />
                                        <span className="text-gray-400 font-bold">Baja</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">
                            Descripción
                        </label>
                        {isEditing ? (
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={8}
                                className="w-full bg-gray-900/50 border border-blue-500/50 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none leading-relaxed"
                                placeholder="Describe tu idea..."
                            />
                        ) : (
                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap bg-gray-900/30 rounded-xl p-4 border border-gray-700/50">
                                {idea.description || 'Sin descripción'}
                            </p>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wide flex items-center gap-2">
                            <Tag size={14} />
                            Tags
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full bg-gray-900/50 border border-blue-500/50 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                placeholder="Ej: Mecánica, Historia, Personaje (separados por coma)"
                            />
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {idea.tags.length > 0 ? (
                                    idea.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="flex items-center gap-1.5 text-xs uppercase font-bold text-blue-300 bg-blue-900/40 border border-blue-500/40 px-3 py-2 rounded-lg shadow-sm"
                                        >
                                            <Sparkles size={12} />
                                            {tag}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 italic">Sin tags</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-700/50">
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-red-900/20 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-red-300 rounded-lg transition-all font-medium"
                        >
                            <Trash2 size={16} />
                            Eliminar
                        </button>

                        <div className="flex gap-3">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        className="px-6 py-2 text-gray-400 hover:text-white transition-colors font-medium"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg shadow-blue-900/40 transition-all"
                                    >
                                        <Save size={16} />
                                        Guardar
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg shadow-blue-900/40 transition-all"
                                >
                                    <Edit2 size={16} />
                                    Editar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
