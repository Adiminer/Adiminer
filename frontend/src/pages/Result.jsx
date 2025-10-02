import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle, Clock, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { saveToHistory } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Result = () => {
  const navigate = useNavigate();
  const { currentProblem, currentSolution, setError, error, clearError } = useApp();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Redirect if no current problem/solution
  React.useEffect(() => {
    if (!currentProblem || !currentSolution) {
      navigate('/');
    }
  }, [currentProblem, currentSolution, navigate]);

  const handleSaveToHistory = async () => {
    if (!currentSolution?.problemId) {
      setError('No problem ID found');
      return;
    }

    setSaving(true);
    clearError();

    try {
      const response = await saveToHistory(currentSolution.problemId);
      if (response.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000); // Hide success message after 3 seconds
      } else {
        setError(response.message || 'Failed to save to history');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  if (!currentProblem || !currentSolution) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center space-x-4">
            {saved && (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Saved to history!</span>
              </div>
            )}
            <button
              onClick={handleSaveToHistory}
              disabled={saving || saved}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              {saving ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{saved ? 'Saved' : 'Save to History'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        <ErrorMessage message={error} onClose={clearError} />

        {/* Problem Section */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Problem</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-800 whitespace-pre-wrap">{currentProblem.text}</p>
            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
              <span className={`px-2 py-1 rounded-full ${
                currentProblem.type === 'text' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {currentProblem.type === 'text' ? 'Text Problem' : 'Image Problem'}
              </span>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Just now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Solution Section */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Solution</h2>
            <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1 rounded-full">
              <Target className="h-4 w-4" />
              <span className="font-medium">{currentSolution.confidence}% Confidence</span>
            </div>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Answer:</h3>
            <p className="text-blue-800 whitespace-pre-wrap">{currentSolution.solution}</p>
          </div>
        </div>

        {/* Steps Section */}
        {currentSolution.steps && currentSolution.steps.length > 0 && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step Solution</h2>
            <div className="space-y-6">
              {currentSolution.steps.map((step, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {step.stepNumber}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{step.description}</h3>
                    <p className="text-gray-700">{step.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={() => navigate('/')}
            className="btn-primary flex-1"
          >
            Solve Another Problem
          </button>
          <button
            onClick={() => navigate('/history')}
            className="btn-secondary flex-1"
          >
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;