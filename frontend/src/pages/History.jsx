import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getHistory, getProblemDetails } from '../services/api';
import HistoryList from '../components/HistoryList';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const History = () => {
  const navigate = useNavigate();
  const { history, setHistory, setCurrentProblem, setCurrentSolution, setError, error, clearError } = useApp();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'text', 'image'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'confidence'

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    clearError();

    try {
      const response = await getHistory();
      if (response.success) {
        setHistory(response.data);
      } else {
        setError(response.message || 'Failed to fetch history');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching history');
    } finally {
      setLoading(false);
    }
  };

  const handleProblemClick = async (problem) => {
    try {
      const response = await getProblemDetails(problem.id);
      if (response.success) {
        setCurrentProblem(response.data.problem);
        setCurrentSolution({
          ...response.data.solution,
          problemId: problem.id,
          problem: response.data.problem.text,
          solution: response.data.solution.answer
        });
        navigate('/result');
      } else {
        setError(response.message || 'Failed to fetch problem details');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching problem details');
    }
  };

  // Filter and sort history
  const filteredAndSortedHistory = React.useMemo(() => {
    if (!history) return [];

    let filtered = history.filter(item => {
      const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.solutionPreview.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || item.type === filterType;
      return matchesSearch && matchesType;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'confidence':
          return b.confidence - a.confidence;
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [history, searchTerm, filterType, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Study History</h1>
          <p className="text-gray-600">Review your previously solved problems and solutions</p>
        </div>

        <ErrorMessage message={error} onClose={clearError} />

        {/* Filters and Search */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search problems..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                className="input-field pl-10 appearance-none"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="text">Text Problems</option>
                <option value="image">Image Problems</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                className="input-field pl-10 appearance-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="confidence">Highest Confidence</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="mt-4 text-sm text-gray-600">
              {filteredAndSortedHistory.length === 0 && searchTerm ? (
                `No problems found matching "${searchTerm}"`
              ) : (
                `Showing ${filteredAndSortedHistory.length} of ${history?.length || 0} problems`
              )}
            </div>
          )}
        </div>

        {/* History List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading your history..." />
          </div>
        ) : (
          <HistoryList
            history={filteredAndSortedHistory}
            onProblemClick={handleProblemClick}
            loading={false}
          />
        )}

        {/* Quick Actions */}
        {!loading && filteredAndSortedHistory.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Solve New Problem
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;