import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles } from 'lucide-react';
import ProblemCard from './ProblemCard';

const HistoryList = ({ history, onProblemClick, onDelete, emptyBecauseFiltered }) => {
  if (!history || history.length === 0) {
    if (emptyBecauseFiltered) {
      return <p className="py-12 text-center text-gray-500">No saved questions match your filters.</p>;
    }
    return (
      <div className="card py-14 text-center">
        <BookOpen className="mx-auto mb-4 h-14 w-14 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-900">Nothing saved yet</h3>
        <p className="mx-auto mt-2 max-w-sm text-gray-500">
          Solve a question and tap “Save to history” to build your revision list.
        </p>
        <Link to="/solve" className="btn-primary mt-6">
          <Sparkles className="h-4 w-4" /> Ask your first question
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {history.map((problem) => (
        <ProblemCard key={problem.id} problem={problem} onClick={onProblemClick} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default HistoryList;
