import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, CheckCircle, Copy, Check, Target, Sparkles, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { saveToHistory } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const confidenceStyle = (c) =>
  c >= 90 ? 'bg-green-50 text-green-700' : c >= 75 ? 'bg-yellow-50 text-yellow-700' : 'bg-primary-50 text-primary-700';

const Result = () => {
  const navigate = useNavigate();
  const { currentProblem, currentSolution, setError, error, clearError } = useApp();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(Boolean(currentSolution?.saved));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!currentProblem || !currentSolution) navigate('/solve', { replace: true });
  }, [currentProblem, currentSolution, navigate]);

  if (!currentProblem || !currentSolution) return null;

  const handleSave = async () => {
    if (!currentSolution.problemId) {
      setError('This solution cannot be saved.');
      return;
    }
    setSaving(true);
    clearError();
    try {
      const response = await saveToHistory(currentSolution.problemId);
      if (response.success) setSaved(true);
      else setError(response.message || 'Failed to save to history');
    } catch (err) {
      setError(err.message || 'An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async () => {
    const steps = (currentSolution.steps || [])
      .map((s) => `${s.stepNumber}. ${s.description}: ${s.explanation}`)
      .join('\n');
    try {
      await navigator.clipboard.writeText(
        `Question: ${currentProblem.text}\nAnswer: ${currentSolution.solution}\n\n${steps}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not copy to the clipboard.');
    }
  };

  const isGuide = currentSolution.subject?.includes('Study guide');

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button onClick={() => navigate('/solve')} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" /> New question
          </button>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="btn-secondary py-2 text-sm">
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button onClick={handleSave} disabled={saving || saved} className="btn-primary py-2 text-sm">
              {saving ? <LoadingSpinner size="sm" text="" /> : saved ? <CheckCircle className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              {saved ? 'Saved to history' : 'Save to history'}
            </button>
          </div>
        </div>

        <ErrorMessage message={error} onClose={clearError} />

        {/* Question */}
        <section className="card mb-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Question</h2>
            {currentSolution.subject && (
              <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                {currentSolution.subject}
              </span>
            )}
          </div>
          {currentProblem.imageUrl && (
            <img src={currentProblem.imageUrl} alt="Uploaded problem" className="mb-4 max-h-60 rounded-xl border border-gray-200 object-contain" />
          )}
          <p className="whitespace-pre-wrap font-mono text-lg text-gray-900">{currentProblem.text}</p>
        </section>

        {/* Answer */}
        <section className="card mb-6 border-primary-200 bg-gradient-to-br from-primary-50 to-white">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-700">
              <Sparkles className="h-4 w-4" /> {isGuide ? 'Miraa says' : 'Answer'}
            </h2>
            {typeof currentSolution.confidence === 'number' && (
              <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${confidenceStyle(currentSolution.confidence)}`}>
                <Target className="h-3.5 w-3.5" /> {currentSolution.confidence}% confidence
              </span>
            )}
          </div>
          <p className={`whitespace-pre-wrap text-gray-900 ${isGuide ? 'text-base' : 'font-display text-2xl font-bold'}`}>
            {currentSolution.solution}
          </p>
        </section>

        {/* Steps */}
        {currentSolution.steps?.length > 0 && (
          <section className="card">
            <h2 className="mb-6 text-xl font-bold text-gray-900">{isGuide ? 'Your study plan' : 'Step-by-step solution'}</h2>
            <ol className="relative space-y-6 border-l-2 border-primary-100 pl-6">
              {currentSolution.steps.map((step, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[2.35rem] flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white ring-4 ring-white">
                    {step.stepNumber ?? i + 1}
                  </span>
                  <h3 className="font-semibold text-gray-900">{step.description}</h3>
                  <p className="mt-1 leading-7 text-gray-700">{step.explanation}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {currentSolution.local && isGuide && (
          <p className="mt-6 flex items-start gap-2 text-sm text-gray-500">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
            Miraa solved this in your browser. Full AI explanations for every subject are coming with Miraa Pro.
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/solve" className="btn-primary flex-1">Ask another question</Link>
          <Link to="/history" className="btn-secondary flex-1">View history</Link>
        </div>
      </div>
    </div>
  );
};

export default Result;
