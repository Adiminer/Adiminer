import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload, Type, Sparkles, ImageIcon, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { solveProblem, isStandalone } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const examples = [
  '2x + 3 = 11',
  'x^2 - 5x + 6 = 0',
  'What is 15% of 80?',
  'sqrt(144) + 3^2',
  'Explain how photosynthesis works',
];

const Solve = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentProblem, setCurrentSolution, setLoading, loading, error, setError, clearError } = useApp();
  const [problemText, setProblemText] = useState(location.state?.question || '');
  const [inputMethod, setInputMethod] = useState('text');
  const [image, setImage] = useState(null); // { name, url }
  const autoSolved = useRef(false);

  useEffect(() => () => image && URL.revokeObjectURL(image.url), [image]);

  const handleSolve = async (textOverride) => {
    const text = (textOverride ?? problemText).trim();
    if (!text) {
      setError(inputMethod === 'image' ? 'Please describe or type out the problem in your image.' : 'Please enter a problem to solve.');
      return;
    }

    clearError();
    setLoading(true);
    try {
      const response = await solveProblem({ text, type: inputMethod });
      if (response.success) {
        setCurrentProblem({ text, type: inputMethod, imageUrl: image?.url });
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

  // Questions sent from the landing page are solved straight away.
  useEffect(() => {
    if (location.state?.autoSolve && location.state.question && !autoSolved.current) {
      autoSolved.current = true;
      handleSolve(location.state.question);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (PNG or JPG).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be 10MB or smaller.');
      return;
    }
    clearError();
    setImage({ name: file.name, url: URL.createObjectURL(file) });
  };

  const tabClass = (active) =>
    `flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
      active ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
    }`;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-primary-50 to-white py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">What are you working on?</h1>
          <p className="mt-3 text-gray-600">Ask Miraa a question and get a step-by-step solution.</p>
        </div>

        <div className="card shadow-lg shadow-primary-900/5">
          <ErrorMessage message={error} onClose={clearError} />

          <div className="mb-5 flex gap-1 rounded-xl bg-gray-100 p-1">
            <button className={tabClass(inputMethod === 'text')} onClick={() => setInputMethod('text')}>
              <Type className="h-4 w-4" /> Type it
            </button>
            <button className={tabClass(inputMethod === 'image')} onClick={() => setInputMethod('image')}>
              <Upload className="h-4 w-4" /> Upload a photo
            </button>
          </div>

          {inputMethod === 'image' && (
            <div className="mb-4">
              {image ? (
                <div className="relative overflow-hidden rounded-xl border border-gray-200">
                  <img src={image.url} alt="Uploaded problem" className="max-h-72 w-full bg-gray-50 object-contain" />
                  <button
                    onClick={() => setImage(null)}
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-gray-600 shadow hover:text-gray-900"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label
                  className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-primary-400"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files[0]); }}
                >
                  <ImageIcon className="mb-3 h-10 w-10 text-gray-400" />
                  <span className="font-medium text-gray-700">Click to upload or drag and drop</span>
                  <span className="mt-1 text-sm text-gray-500">PNG or JPG, up to 10MB</span>
                  <input type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files[0])} />
                </label>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Photo recognition is coming with Miraa Pro. For now, type the problem from your photo below.
              </p>
            </div>
          )}

          <label htmlFor="problem-text" className="mb-2 block text-sm font-medium text-gray-700">
            {inputMethod === 'image' ? 'Type the problem from your photo' : 'Your question'}
          </label>
          <textarea
            id="problem-text"
            rows={4}
            className="input-field resize-none font-mono text-[15px]"
            placeholder="e.g. 3(y - 2) = 2y + 5"
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSolve();
            }}
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => setProblemText(ex)}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-primary-100 hover:text-primary-700"
              >
                {ex}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleSolve()}
            disabled={loading || !problemText.trim()}
            className="btn-primary mt-6 w-full py-3 text-base"
          >
            {loading ? (
              <LoadingSpinner size="sm" text="" />
            ) : (
              <>
                <Sparkles className="h-5 w-5" /> Solve with Miraa
              </>
            )}
          </button>
          <p className="mt-3 text-center text-xs text-gray-500">
            Tip: press Ctrl + Enter to solve.
            {isStandalone() && ' Running in your browser — your questions stay on this device.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Solve;
