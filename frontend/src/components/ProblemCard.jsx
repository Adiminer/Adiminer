import React from 'react';
import { Clock, Trash2 } from 'lucide-react';

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

const confidenceColor = (c) =>
  c >= 90 ? 'text-green-700 bg-green-50' : c >= 75 ? 'text-yellow-700 bg-yellow-50' : 'text-primary-700 bg-primary-50';

const ProblemCard = ({ problem, onClick, onDelete }) => (
  <div
    role="button"
    tabIndex={0}
    className="card cursor-pointer transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
    onClick={() => onClick(problem)}
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(problem)}
  >
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-mono text-base font-semibold text-gray-900">{problem.text}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-600">{problem.solutionPreview}</p>
      </div>
      <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${confidenceColor(problem.confidence)}`}>
        {problem.confidence}%
      </span>
    </div>

    <div className="mt-4 flex items-center justify-between gap-2 text-xs text-gray-500">
      <span className="flex items-center gap-1">
        <Clock className="h-3.5 w-3.5" /> {formatDate(problem.createdAt)}
      </span>
      <div className="flex items-center gap-2">
        {problem.subject && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-700">{problem.subject}</span>
        )}
        <span className={`rounded-full px-2 py-0.5 font-medium ${problem.type === 'image' ? 'bg-pink-50 text-pink-700' : 'bg-blue-50 text-blue-700'}`}>
          {problem.type === 'image' ? 'Photo' : 'Text'}
        </span>
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(problem); }}
            className="rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
            aria-label="Delete from history"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  </div>
);

export default ProblemCard;
