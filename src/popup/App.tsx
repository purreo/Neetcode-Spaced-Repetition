import { useEffect, useState, useCallback } from 'react';
import { ProblemCard } from './components/ProblemCard';
import { LibraryItem } from './components/LibraryItem';
import { storage, ProblemData } from '../shared/storage';
import { calculateNextReview, ReviewGrade } from '../shared/sm2';
import { PlusCircle, RefreshCcw, Library, CalendarCheck } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'due' | 'library'>('due');
  const [problems, setProblems] = useState<ProblemData[]>([]);
  const [libraryProblems, setLibraryProblems] = useState<ProblemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSlug, setNewSlug] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    if (view === 'due') {
      const due = await storage.getDueProblems();
      setProblems(due);
    } else {
      const all = await storage.getAllProblems();
      // Sort by nextReview
      all.sort((a, b) => a.nextReview - b.nextReview);
      setLibraryProblems(all);
    }
    setLoading(false);
  }, [view]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleGrade = async (slug: string, grade: ReviewGrade) => {
    const existing = await storage.getProblem(slug);
    const newState = calculateNextReview(grade, existing || undefined);
    await storage.saveProblem(slug, newState);
    // Remove from current view
    setProblems(prev => prev.filter(p => p.slug !== slug));
  };

  const handleDelete = async (slug: string) => {
    await storage.deleteProblem(slug);
    setLibraryProblems(prev => prev.filter(p => p.slug !== slug));
  };

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlug.trim()) return;
    
    const slug = newSlug.trim();
    const existing = await storage.getProblem(slug);
    
    let state;
    if (!existing) {
      state = { interval: 0, ease: 2.5, repetitions: 0, nextReview: 0 };
    } else {
      // Bring existing problem to "Due" state so user can re-rate it
      state = existing;
      state.nextReview = 0;
    }
    
    await storage.saveProblem(slug, state);
    setNewSlug('');
    setShowAdd(false);
    loadData();
  };

  return (
    <div className="bg-slate-50 min-h-[500px] text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-bold text-indigo-600 leading-none mb-1">Neetcode</h1>
          <p className="text-xs text-slate-500 font-medium">Spaced Repetition</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={loadData}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
            title="Refresh"
          >
            <RefreshCcw size={18} />
          </button>
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className={`p-1.5 rounded-md transition-colors ${showAdd ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
            title="Manual Add"
          >
            <PlusCircle size={18} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 flex text-sm">
        <button
          onClick={() => setView('due')}
          className={`flex-1 py-2 font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${view === 'due' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          <CalendarCheck size={16} /> Due Today
        </button>
        <button
          onClick={() => setView('library')}
          className={`flex-1 py-2 font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${view === 'library' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          <Library size={16} /> Library
        </button>
      </div>

      {showAdd && (
        <div className="bg-white border-b border-slate-200 p-4 shadow-sm transition-all duration-200">
          <form onSubmit={handleManualAdd} className="flex gap-2">
            <input 
              type="text" 
              value={newSlug}
              onChange={e => setNewSlug(e.target.value)}
              placeholder="Problem slug (e.g. two-sum)"
              className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              autoFocus
            />
            <button 
              type="submit"
              className="bg-indigo-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Add
            </button>
          </form>
        </div>
      )}

      <main className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin text-indigo-500"><RefreshCcw /></div>
          </div>
        ) : view === 'due' ? (
          problems.length === 0 ? (
            <div className="text-center py-10">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-indigo-50 text-indigo-300 mb-4">
                <CalendarCheck size={32} />
              </div>
              <h2 className="text-slate-700 font-medium mb-1">You're all caught up!</h2>
              <p className="text-sm text-slate-500">No problems due right now.<br/>Solve more on Neetcode!</p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex justify-between items-end mb-3 px-1">
                <h2 className="text-sm font-semibold text-slate-600">Due Queue</h2>
                <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                  {problems.length}
                </span>
              </div>
              {problems.map(p => (
                <ProblemCard key={p.slug} problem={p} onGrade={handleGrade} />
              ))}
            </div>
          )
        ) : (
          /* Library View */
          libraryProblems.length === 0 ? (
            <div className="text-center py-10">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
                <Library size={32} />
              </div>
              <h2 className="text-slate-700 font-medium mb-1">Library is empty</h2>
              <p className="text-sm text-slate-500">Problems you solve will appear here.</p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex justify-between items-end mb-3 px-1">
                <h2 className="text-sm font-semibold text-slate-600">All Problems</h2>
                <span className="text-xs font-medium bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                  {libraryProblems.length}
                </span>
              </div>
              {libraryProblems.map(p => (
                <LibraryItem key={p.slug} problem={p} onDelete={handleDelete} />
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}
