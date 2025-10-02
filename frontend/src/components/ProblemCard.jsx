import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

const ProblemCard = ({ problem, onClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 90) return CheckCircle;
    if (confidence >= 70) return AlertCircle;
    return AlertCircle;
  };

  const ConfidenceIcon = getConfidenceIcon(problem.confidence);

  return (
    <div 
      className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={() => onClick(problem)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {problem.text.length > 100 
              ? `${problem.text.substring(0, 100)}...` 
              : problem.text
            }
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {problem.solutionPreview}
          </p>
        </div>
        
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(problem.confidence)}`}>
          <ConfidenceIcon className="h-3 w-3" />
          <span>{problem.confidence}%</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>{formatDate(problem.createdAt)}</span>
        </div>
        
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          problem.type === 'text' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-purple-100 text-purple-800'
        }`}>
          {problem.type === 'text' ? 'Text' : 'Image'}
        </span>
      </div>
    </div>
  );
};

export default ProblemCard;