import React from 'react';
import ProblemCard from './ProblemCard';
import { FileText, Search } from 'lucide-react';

const HistoryList = ({ history, onProblemClick, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="flex justify-between">
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No problems solved yet</h3>
        <p className="text-gray-500 mb-6">
          Start solving problems to see your history here.
        </p>
        <a 
          href="/" 
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Search className="h-4 w-4" />
          <span>Solve Your First Problem</span>
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((problem) => (
        <ProblemCard
          key={problem.id}
          problem={problem}
          onClick={onProblemClick}
        />
      ))}
    </div>
  );
};

export default HistoryList;