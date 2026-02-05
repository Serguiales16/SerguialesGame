import React, { useState, useEffect } from 'react';
import { Game, GameStatus, Idea, AppProject, LearningItem } from './types';
import { loadGames, saveGames, loadIdeas, saveIdeas, loadApps, saveApps, loadLearning, saveLearning } from './services/storageService';
import { getCurrentUser, logout as authLogout } from './services/authService';
import { LoginScreen } from './components/LoginScreen';
import { GameCard } from './components/GameCard';
import { IdeaCard } from './components/IdeaCard';
import { IdeaDetailModal } from './components/IdeaDetailModal';
import { AppCard } from './components/AppCard';
import { LearningCard } from './components/LearningCard';
import { GameDetailView } from './components/GameDetailView';
import { Plus, Search, Gamepad2, Sparkles, Filter, PlayCircle, CheckCircle2, Lightbulb, Brain, Rocket, BookOpen, Code2, LogOut } from 'lucide-react';

type Tab = 'games' | 'ideas' | 'apps' | 'learn';
type Theme = 'red' | 'blue' | 'purple' | 'emerald';

// Helper to get theme configs
const getThemeConfig = (tab: Tab) => {
    switch (tab) {
        case 'games': return { color: 'red', text: 'Game', icon: Gamepad2, primary: 'text-primary-500', bg: 'bg-primary-600 hover:bg-primary-500', border: 'border-primary-500', shadow: 'shadow-primary-900/40' };
        case 'ideas': return { color: 'blue', text: 'Ideas', icon: Lightbulb, primary: 'text-blue-500', bg: 'bg-blue-600 hover:bg-blue-500', border: 'border-blue-500', shadow: 'shadow-blue-900/40' };
        case 'apps': return { color: 'purple', text: 'Apps', icon: Rocket, primary: 'text-purple-500', bg: 'bg-purple-600 hover:bg-purple-500', border: 'border-purple-500', shadow: 'shadow-purple-900/40' };
        case 'learn': return { color: 'emerald', text: 'Learn', icon: BookOpen, primary: 'text-emerald-500', bg: 'bg-emerald-600 hover:bg-emerald-500', border: 'border-emerald-500', shadow: 'shadow-emerald-900/40' };
    }
};

// Dynamic Logo
const AppLogo = ({ color }: { color: string }) => {
    const colorClass =
        color === 'red' ? 'text-primary-500' :
            color === 'blue' ? 'text-blue-500' :
                color === 'purple' ? 'text-purple-500' : 'text-emerald-500';

    return (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={colorClass}>
            <path d="M20 4L4 12V28L20 36L36 28V12L20 4Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 20H18M16 18V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="25" cy="19" r="1.5" fill="currentColor" />
            <circle cx="28" cy="22" r="1.5" fill="currentColor" />
            <path d="M20 36V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

const FilterChip = ({ label, active, onClick, icon: Icon }: { label: string; active: boolean; onClick: () => void; icon?: React.ElementType }) => (
    <button onClick={onClick} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${active ? 'bg-primary-900/30 border-primary-500 text-primary-400 shadow-[0_0_8px_rgba(220,38,38,0.2)]' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200'}`}>
        {Icon && <Icon size={12} />} {label}
    </button>
);

function App() {
    // --- Auth State ---
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [activeTab, setActiveTab] = useState<Tab>('games');
    const t = getThemeConfig(activeTab);

    // --- Games State ---
    const [games, setGames] = useState<Game[]>([]);
    const [view, setView] = useState<'dashboard' | 'detail'>('dashboard');
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
    const [isAddingGame, setIsAddingGame] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | GameStatus>('ALL');
    const [newTitle, setNewTitle] = useState('');
    const [newPlatform, setNewPlatform] = useState('');

    // --- Ideas State ---
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [isAddingIdea, setIsAddingIdea] = useState(false);
    const [newIdeaTitle, setNewIdeaTitle] = useState('');
    const [newIdeaDesc, setNewIdeaDesc] = useState('');
    const [newIdeaTags, setNewIdeaTags] = useState('');
    const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);

    // --- Apps State ---
    const [apps, setApps] = useState<AppProject[]>([]);
    const [isAddingApp, setIsAddingApp] = useState(false);
    const [newAppName, setNewAppName] = useState('');
    const [newAppDesc, setNewAppDesc] = useState('');
    const [newAppUrl, setNewAppUrl] = useState('');
    const [newAppStack, setNewAppStack] = useState('');

    // --- Learn State ---
    const [learnItems, setLearnItems] = useState<LearningItem[]>([]);
    const [isAddingLearn, setIsAddingLearn] = useState(false);
    const [newLearnTopic, setNewLearnTopic] = useState('');
    const [newLearnCat, setNewLearnCat] = useState('Frontend');
    const [newLearnStatus, setNewLearnStatus] = useState<'To Learn' | 'Learning' | 'Mastered'>('Learning');

    // --- Effects ---
    // Check authentication on mount
    useEffect(() => {
        const user = getCurrentUser();
        if (user) {
            setCurrentUser(user);
            setIsAuthenticated(true);
        }
    }, []);

    // Load user data when authenticated
    useEffect(() => {
        if (currentUser) {
            setGames(loadGames(currentUser));
            setIdeas(loadIdeas(currentUser));
            setApps(loadApps(currentUser));
            setLearnItems(loadLearning(currentUser));
        }
    }, [currentUser]);

    useEffect(() => { if (games.length > 0 && currentUser) saveGames(currentUser, games); }, [games, currentUser]);
    useEffect(() => { if (ideas.length > 0 && currentUser) saveIdeas(currentUser, ideas); }, [ideas, currentUser]);
    useEffect(() => { if (apps.length > 0 && currentUser) saveApps(currentUser, apps); }, [apps, currentUser]);
    useEffect(() => { if (learnItems.length > 0 && currentUser) saveLearning(currentUser, learnItems); }, [learnItems, currentUser]);

    // --- Handlers: Games ---
    const handleCreateGame = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        const newGame: Game = {
            id: Date.now().toString(),
            title: newTitle,
            platform: newPlatform || 'PC',
            status: GameStatus.PLAYING,
            completionPercentage: 0,
            sessions: [],
            notes: ''
        };
        setGames([newGame, ...games]);
        setNewTitle(''); setNewPlatform(''); setIsAddingGame(false); setStatusFilter('ALL');
    };
    const updateGame = (updatedGame: Game) => setGames(prev => prev.map(g => g.id === updatedGame.id ? updatedGame : g));
    const deleteGame = (id: string) => { setGames(prev => prev.filter(g => g.id !== id)); setView('dashboard'); setSelectedGameId(null); };

    // --- Handlers: Ideas ---
    const handleCreateIdea = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newIdeaTitle.trim()) return;
        const newIdea: Idea = {
            id: Date.now().toString(),
            title: newIdeaTitle,
            description: newIdeaDesc,
            createdAt: new Date().toISOString(),
            tags: newIdeaTags.split(',').map(t => t.trim()).filter(t => t.length > 0),
            priority: 'medium'
        };
        setIdeas([newIdea, ...ideas]);
        setNewIdeaTitle(''); setNewIdeaDesc(''); setNewIdeaTags(''); setIsAddingIdea(false);
    };
    const updateIdea = (updatedIdea: Idea) => setIdeas(prev => prev.map(i => i.id === updatedIdea.id ? updatedIdea : i));
    const deleteIdea = (id: string) => setIdeas(prev => prev.filter(i => i.id !== id));

    // --- Handlers: Apps ---
    const handleCreateApp = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAppName.trim()) return;
        const newApp: AppProject = {
            id: Date.now().toString(),
            name: newAppName,
            description: newAppDesc,
            url: newAppUrl.trim() || undefined,
            techStack: newAppStack.split(',').map(t => t.trim()).filter(t => t.length > 0),
            status: 'Development'
        };
        setApps([newApp, ...apps]);
        setNewAppName(''); setNewAppDesc(''); setNewAppUrl(''); setNewAppStack(''); setIsAddingApp(false);
    }
    const deleteApp = (id: string) => setApps(prev => prev.filter(a => a.id !== id));

    // --- Handlers: Learn ---
    const handleCreateLearn = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLearnTopic.trim()) return;
        const newItem: LearningItem = {
            id: Date.now().toString(),
            topic: newLearnTopic,
            category: newLearnCat,
            status: newLearnStatus
        };
        setLearnItems([newItem, ...learnItems]);
        setNewLearnTopic(''); setIsAddingLearn(false);
    }
    const deleteLearn = (id: string) => setLearnItems(prev => prev.filter(l => l.id !== id));

    // --- Handlers: Auth ---
    const handleLoginSuccess = () => {
        const user = getCurrentUser();
        if (user) {
            setCurrentUser(user);
            setIsAuthenticated(true);
        }
    };

    const handleLogout = () => {
        authLogout();
        setCurrentUser(null);
        setIsAuthenticated(false);
        setGames([]);
        setIdeas([]);
        setApps([]);
        setLearnItems([]);
    };

    // Show login screen if not authenticated
    if (!isAuthenticated) {
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
    }

    const filteredGames = games.filter(g => {
        const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || g.platform.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || g.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-gray-700 selection:text-white">

            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 transition-colors duration-500">
                <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">

                    {/* Logo */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group self-start sm:self-center"
                        onClick={() => { if (activeTab === 'games') { setView('dashboard'); setSelectedGameId(null); } }}
                    >
                        <div className={`group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-all duration-300`}>
                            <AppLogo color={t.color} />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl tracking-tight text-white leading-none group-hover:text-gray-200 transition-colors">
                                Serguiales<span className={`${t.primary} transition-colors duration-500`}>{t.text}</span>
                            </h1>
                            <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">Personal Hub</p>
                        </div>
                    </div>

                    {/* User Info & Logout */}
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-xs text-gray-400">Usuario</p>
                            <p className="text-sm font-bold text-white">{currentUser}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-lg text-gray-400 hover:text-white transition-all text-xs font-medium"
                            title="Cerrar sesión"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>

                    {/* Tab Switcher - Now scrollable on mobile */}
                    <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700 overflow-x-auto max-w-full no-scrollbar w-full sm:w-auto">
                        {(['games', 'ideas', 'apps', 'learn'] as Tab[]).map((tabName) => {
                            const conf = getThemeConfig(tabName);
                            const isActive = activeTab === tabName;
                            const Icon = conf.icon;
                            // Custom active colors per tab
                            const activeClass =
                                tabName === 'games' ? 'bg-gray-700 text-white shadow-sm' :
                                    tabName === 'ideas' ? 'bg-gray-700 text-blue-400 shadow-sm' :
                                        tabName === 'apps' ? 'bg-gray-700 text-purple-400 shadow-sm' :
                                            'bg-gray-700 text-emerald-400 shadow-sm';

                            return (
                                <button
                                    key={tabName}
                                    onClick={() => setActiveTab(tabName)}
                                    className={`px-4 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${isActive ? activeClass : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    <Icon size={14} /> {conf.text}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">

                {/* ================= GAMES TAB ================= */}
                {activeTab === 'games' && (
                    <>
                        {view === 'dashboard' && (
                            <div className="animate-in fade-in duration-500">
                                <div className="flex flex-col gap-5 mb-10">
                                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                                        <div className="relative w-full md:w-96 group">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                                            <input type="text" placeholder="Buscar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all shadow-sm hover:border-gray-600" />
                                        </div>
                                        <button onClick={() => setIsAddingGame(true)} className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] active:scale-95">
                                            <Plus size={18} /> Nuevo Juego
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
                                        <Filter size={14} className="text-gray-600 shrink-0 mr-1" />
                                        <FilterChip label="Todos" active={statusFilter === 'ALL'} onClick={() => setStatusFilter('ALL')} />
                                        <FilterChip label="Jugando" active={statusFilter === GameStatus.PLAYING} onClick={() => setStatusFilter(GameStatus.PLAYING)} icon={PlayCircle} />
                                        <FilterChip label="Completados" active={statusFilter === GameStatus.COMPLETED} onClick={() => setStatusFilter(GameStatus.COMPLETED)} icon={CheckCircle2} />
                                        <FilterChip label="Otros" active={statusFilter === GameStatus.ABANDONED} onClick={() => setStatusFilter(GameStatus.ABANDONED)} />
                                    </div>
                                </div>

                                {filteredGames.length === 0 && !isAddingGame && (
                                    <div className="text-center py-24 opacity-60">
                                        <div className="bg-gray-800 border border-gray-700 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"><Gamepad2 size={48} className="text-gray-500" /></div>
                                        <h3 className="text-xl font-bold text-gray-200 mb-2">Sin juegos</h3>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {isAddingGame && (
                                        <div className="bg-gray-800 border-2 border-primary-500/50 rounded-2xl p-6 shadow-2xl shadow-primary-900/20 animate-in zoom-in-95 duration-200">
                                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Plus size={20} className="text-primary-500" /> Añadir Juego</h3>
                                            <form onSubmit={handleCreateGame}>
                                                <div className="space-y-4 mb-6">
                                                    <input autoFocus type="text" placeholder="Ej: Elden Ring" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-primary-500 outline-none" />
                                                    <input type="text" placeholder="Ej: PC" value={newPlatform} onChange={(e) => setNewPlatform(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-primary-500 outline-none" />
                                                </div>
                                                <div className="flex gap-3">
                                                    <button type="button" onClick={() => setIsAddingGame(false)} className="flex-1 py-2 text-gray-400 hover:text-white">Cancelar</button>
                                                    <button type="submit" className="flex-1 py-2 bg-primary-600 text-white rounded-lg font-bold">Guardar</button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                    {filteredGames.map(game => <GameCard key={game.id} game={game} onClick={(g) => { setSelectedGameId(g.id); setView('detail'); }} />)}
                                </div>
                            </div>
                        )}
                        {view === 'detail' && selectedGameId && <GameDetailView game={games.find(g => g.id === selectedGameId)!} onBack={() => { setView('dashboard'); setSelectedGameId(null); }} onUpdateGame={updateGame} onDeleteGame={deleteGame} />}
                    </>
                )}

                {/* ================= IDEAS TAB ================= */}
                {activeTab === 'ideas' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-bold text-white">Laboratorio de Ideas</h2>
                            <button onClick={() => setIsAddingIdea(true)} className={`flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold shadow-lg ${t.bg} ${t.shadow}`}><Plus size={18} /> Nueva Idea</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            {isAddingIdea && (
                                <div className={`bg-gray-800 border-2 ${t.border} rounded-2xl p-6 shadow-2xl ${t.shadow} animate-in zoom-in-95 duration-200`}>
                                    <h3 className="text-lg font-bold text-white mb-4">Nueva Idea</h3>
                                    <form onSubmit={handleCreateIdea}>
                                        <div className="space-y-4 mb-6">
                                            <input autoFocus type="text" placeholder="Título" value={newIdeaTitle} onChange={(e) => setNewIdeaTitle(e.target.value)} className={`w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:${t.border} outline-none`} />
                                            <textarea placeholder="Descripción..." value={newIdeaDesc} onChange={(e) => setNewIdeaDesc(e.target.value)} className={`w-full h-24 bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:${t.border} outline-none resize-none`} />
                                            <input type="text" placeholder="Tags" value={newIdeaTags} onChange={(e) => setNewIdeaTags(e.target.value)} className={`w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:${t.border} outline-none`} />
                                        </div>
                                        <div className="flex gap-3">
                                            <button type="button" onClick={() => setIsAddingIdea(false)} className="flex-1 text-gray-400 hover:text-white">Cancelar</button>
                                            <button type="submit" className={`flex-1 py-2 text-white rounded-lg font-bold ${t.bg}`}>Guardar</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                            {ideas.map(idea => <IdeaCard key={idea.id} idea={idea} onDelete={deleteIdea} onClick={(i) => setSelectedIdeaId(i.id)} />)}
                        </div>

                        {/* Idea Detail Modal */}
                        {selectedIdeaId && (
                            <IdeaDetailModal
                                idea={ideas.find(i => i.id === selectedIdeaId)!}
                                onClose={() => setSelectedIdeaId(null)}
                                onUpdate={updateIdea}
                                onDelete={deleteIdea}
                            />
                        )}
                    </div>
                )}

                {/* ================= APPS TAB ================= */}
                {activeTab === 'apps' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Serguiales Apps</h2>
                                <p className="text-gray-500 text-sm">Portfolio de desarrollos.</p>
                            </div>
                            <button onClick={() => setIsAddingApp(true)} className={`flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold shadow-lg ${t.bg} ${t.shadow}`}><Plus size={18} /> Crear App</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {isAddingApp && (
                                <div className={`bg-gray-800 border-2 ${t.border} rounded-2xl p-6 shadow-2xl ${t.shadow} animate-in zoom-in-95 duration-200`}>
                                    <h3 className="text-lg font-bold text-white mb-4">Registrar App</h3>
                                    <form onSubmit={handleCreateApp}>
                                        <div className="space-y-4 mb-6">
                                            <input autoFocus type="text" placeholder="Nombre de la App" value={newAppName} onChange={(e) => setNewAppName(e.target.value)} className={`w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:${t.border} outline-none`} />
                                            <textarea placeholder="Descripción breve" value={newAppDesc} onChange={(e) => setNewAppDesc(e.target.value)} className={`w-full h-20 bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:${t.border} outline-none resize-none`} />
                                            <input type="url" placeholder="URL (https://...)" value={newAppUrl} onChange={(e) => setNewAppUrl(e.target.value)} className={`w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:${t.border} outline-none`} />
                                            <input type="text" placeholder="Stack (React, Node, etc)" value={newAppStack} onChange={(e) => setNewAppStack(e.target.value)} className={`w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:${t.border} outline-none`} />
                                        </div>
                                        <div className="flex gap-3">
                                            <button type="button" onClick={() => setIsAddingApp(false)} className="flex-1 text-gray-400 hover:text-white">Cancelar</button>
                                            <button type="submit" className={`flex-1 py-2 text-white rounded-lg font-bold ${t.bg}`}>Guardar</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                            {apps.map(app => <AppCard key={app.id} app={app} onDelete={deleteApp} />)}
                        </div>
                    </div>
                )}

                {/* ================= LEARN TAB ================= */}
                {activeTab === 'learn' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Serguiales Learn</h2>
                                <p className="text-gray-500 text-sm">Roadmap de conocimientos.</p>
                            </div>
                            <button onClick={() => setIsAddingLearn(true)} className={`flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold shadow-lg ${t.bg} ${t.shadow}`}><Plus size={18} /> Nuevo Tema</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {isAddingLearn && (
                                <div className={`bg-gray-800 border-2 ${t.border} rounded-2xl p-6 shadow-2xl ${t.shadow} animate-in zoom-in-95 duration-200`}>
                                    <h3 className="text-lg font-bold text-white mb-4">Aprender algo nuevo</h3>
                                    <form onSubmit={handleCreateLearn}>
                                        <div className="space-y-4 mb-6">
                                            <input autoFocus type="text" placeholder="Tema (ej. Docker)" value={newLearnTopic} onChange={(e) => setNewLearnTopic(e.target.value)} className={`w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:${t.border} outline-none`} />
                                            <select value={newLearnCat} onChange={(e) => setNewLearnCat(e.target.value)} className={`w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:${t.border} outline-none`}>
                                                <option value="Frontend">Frontend</option>
                                                <option value="Backend">Backend</option>
                                                <option value="DevOps">DevOps</option>
                                                <option value="Design">Design</option>
                                                <option value="Soft Skills">Soft Skills</option>
                                            </select>
                                            <select value={newLearnStatus} onChange={(e) => setNewLearnStatus(e.target.value as any)} className={`w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:${t.border} outline-none`}>
                                                <option value="To Learn">Por Aprender</option>
                                                <option value="Learning">Aprendiendo</option>
                                                <option value="Mastered">Dominado</option>
                                            </select>
                                        </div>
                                        <div className="flex gap-3">
                                            <button type="button" onClick={() => setIsAddingLearn(false)} className="flex-1 text-gray-400 hover:text-white">Cancelar</button>
                                            <button type="submit" className={`flex-1 py-2 text-white rounded-lg font-bold ${t.bg}`}>Guardar</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                            {learnItems.map(item => <LearningCard key={item.id} item={item} onDelete={deleteLearn} />)}
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}

export default App;