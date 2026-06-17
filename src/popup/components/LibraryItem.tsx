import { ProblemData } from '../../shared/storage';
import { Trash2 } from 'lucide-react';

interface Props {
  problem: ProblemData;
  onDelete: (slug: string) => void;
}

export function LibraryItem({ problem, onDelete }: Props) {
  const date = new Date(problem.nextReview);
  const dateString = date.toLocaleDateString();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 mb-2 flex flex-col gap-2 transition-all hover:shadow-md">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-slate-800 text-sm truncate flex-1 hover:text-indigo-600 transition-colors">
          <a href={`https://neetcode.io/problems/${problem.slug}`} target="_blank" rel="noreferrer" title="Open on Neetcode">
            {problem.slug}
          </a>
        </h3>
        <button 
          onClick={() => onDelete(problem.slug)}
          className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
          title="Delete problem"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
        <div className="flex flex-col">
          <span className="font-medium text-slate-400 uppercase text-[10px] tracking-wider">Next Review</span>
          <span className="text-slate-700">{problem.nextReview <= Date.now() ? 'Due Now' : dateString}</span>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="font-medium text-slate-400 uppercase text-[10px] tracking-wider">Ease</span>
            <span className="text-slate-700">{problem.ease.toFixed(2)}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="font-medium text-slate-400 uppercase text-[10px] tracking-wider">Lvl</span>
            <span className="text-slate-700">{problem.repetitions}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
