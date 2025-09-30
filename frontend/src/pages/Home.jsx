import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Type, Zap, BookOpen, Target, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { solveProblem } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Home = () => {
  const navigate = useNavigate();
  const { setCurrentProblem, setCurrentSolution, setLoading, loading, error, setError, clearError } = useApp();
  const [problemText, setProblemText] = useState('');
  const [inputMethod, setInputMethod] = useState('text'); // 'text' or 'image'

  const handleSolveProblem = async () => {
    if (!problemText.trim()) {
      setError('Please enter a problem to solve');
      return;
    }

    clearError();
    setLoading(true);

    try {
      const response = await solveProblem({
        text: problemText,
        type: inputMethod
      });

      if (response.success) {
        setCurrentProblem({
          text: problemText,
          type: inputMethod
        });
        setCurrentSolution(response.data);
        navigate('/result');
      } else {
        setError(response.message || 'Failed to solve problem');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while solving the problem');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Zap,
      title: 'Instant Solutions',
      description: 'Get step-by-step solutions to your problems in seconds'
    },
    {
      icon: BookOpen,
      title: 'Detailed Explanations',
      description: 'Understand the reasoning behind each solution step'
    },
    {
      icon: Target,
      title: 'High Accuracy',
      description: 'AI-powered solutions with confidence ratings'
    },
    {
      icon: Users,
      title: 'Study History',
      description: 'Track your progress and revisit previous problems'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your AI Study
            <span className="text-primary-600"> Companion</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get instant, step-by-step solutions to your academic problems. 
            Upload an image or type your question to get started.
          </p>
        </div>

        {/* Main Problem Solver */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Solve Your Problem
            </h2>

            <ErrorMessage message={error} onClose={clearError} />

            {/* Input Method Selection */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setInputMethod('text')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-colors ${
                  inputMethod === 'text'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Type className="h-5 w-5" />
                <span>Enter Text</span>
              </button>
              <button
                onClick={() => setInputMethod('image')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-colors ${
                  inputMethod === 'image'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Upload className="h-5 w-5" />
                <span>Upload Image</span>
              </button>
            </div>

            {/* Problem Input */}
            {inputMethod === 'text' ? (
              <div className="mb-6">
                <label htmlFor="problem-text" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your problem:
                </label>
                <textarea
                  id="problem-text"
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Type your math problem, question, or any academic challenge here..."
                  value={problemText}
                  onChange={(e) => setProblemText(e.target.value)}
                />
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload an image of your problem:
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setProblemText(`Image uploaded: ${file.name}`);
                      }
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Note: Image processing is coming soon. For now, please describe your problem in the text area above.
                </p>
              </div>
            )}

            {/* Solve Button */}
            <button
              onClick={handleSolveProblem}
              disabled={loading || !problemText.trim()}
              className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <LoadingSpinner size="sm" text="Solving..." />
              ) : (
                'Solve Problem'
              )}
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                <feature.icon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;