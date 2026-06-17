import { ProblemData } from '../../shared/storage';
import { ReviewGrade } from '../../shared/sm2';

interface Props {
  problem: ProblemData;
  onGrade: (slug: string, grade: ReviewGrade) => void;
}

export function ProblemCard({ problem, onGrade }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-3 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-slate-800 text-lg truncate flex-1 hover:text-indigo-600 transition-colors">
          <a href={`https://neetcode.io/problems/${problem.slug}`} target="_blank" rel="noreferrer" title="Open on Neetcode">
            {problem.slug}
          </a>
        </h3>
        <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded">
          Lvl {problem.repetitions}
        </span>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        <button 
          onClick={() => onGrade(problem.slug, 'again')}
          className="py-1.5 px-1 bg-red-50 text-red-700 hover:bg-red-100 rounded text-xs font-medium transition-colors"
        >
          Again (1d)
        </button>
        <button 
          onClick={() => onGrade(problem.slug, 'hard')}
          className="py-1.5 px-1 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded text-xs font-medium transition-colors"
        >
          Hard
        </button>
        <button 
          onClick={() => onGrade(problem.slug, 'good')}
          className="py-1.5 px-1 bg-green-50 text-green-700 hover:bg-green-100 rounded text-xs font-medium transition-colors"
        >
          Good
        </button>
        <button 
          onClick={() => onGrade(problem.slug, 'easy')}
          className="py-1.5 px-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-medium transition-colors"
        >
          Easy
        </button>
      </div>
    </div>
  );
}
