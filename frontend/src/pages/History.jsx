import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getHistory, getProblemDetails, deleteFromHistory, clearHistory, isStandalone } from '../services/api';
import HistoryList from '../components/HistoryList';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const History = () => {
  const navigate = useNavigate();
  const { history, setHistory, setCurrentProblem, setCurrentSolution, setError, error, clearError } = useApp();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const canEdit = isStandalone() || history.some((h) => h.local);

  const fetchHistory = async () => {
    setLoading(true);
    clearError();
    try {
      const response = await getHistory();
      if (response.success) setHistory(response.data);
      else setError(response.message || 'Failed to fetch history');
    } catch (err) {
      setError(err.message || 'An error occurred while fetching history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpen = async (problem) => {
    try {
      const response = await getProblemDetails(problem.id);
      if (response.success) {
        const { problem: p, solution: s } = response.data;
        setCurrentProblem(p);
        setCurrentSolution({ ...s, problemId: problem.id, problem: p.text, solution: s.answer, saved: true, local: problem.local });
        navigate('/result');
      } else {
        setError(response.message || 'Failed to fetch problem details');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching problem details');
    }
  };

  const handleDelete = (problem) => {
    deleteFromHistory(problem.id);
    setHistory(history.filter((h) => h.id !== problem.id));
  };

  const handleClear = () => {
    if (window.confirm('Delete all saved questions from this browser?')) {
      clearHistory();
      setHistory([]);
    }
  };

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return (history || [])
      .filter((item) =>
        (item.text.toLowerCase().includes(term) || item.solutionPreview.toLowerCase().includes(term)) &&
        (filterType === 'all' || item.type === filterType)
      )
      .sort((a, b) => {
        if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === 'confidence') return b.confidence - a.confidence;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [history, searchTerm, filterType, sortBy]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Your history</h1>
            <p className="mt-1 text-gray-600">Saved questions and solutions to revise from.</p>
          </div>
          {canEdit && history.length > 0 && (
            <button onClick={handleClear} className="btn-secondary py-2 text-sm text-red-600">
              <Trash2 className="h-4 w-4" /> Clear all
            </button>
          )}
        </div>

        <ErrorMessage message={error} onClose={clearError} />

        <div className="card mb-6 p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select className="input-field appearance-none pl-10" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">All types</option>
                <option value="text">Typed questions</option>
                <option value="image">Photo questions</option>
              </select>
            </div>
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select className="input-field appearance-none pl-10" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="confidence">Highest confidence</option>
              </select>
            </div>
          </div>
          {!loading && history.length > 0 && (
            <p className="mt-3 text-sm text-gray-500">Showing {filtered.length} of {history.length}</p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading your history..." />
          </div>
        ) : (
          <HistoryList
            history={filtered}
            onProblemClick={handleOpen}
            onDelete={canEdit ? handleDelete : undefined}
            emptyBecauseFiltered={history.length > 0}
          />
        )}
      </div>
    </div>
  );
};

export default History;
