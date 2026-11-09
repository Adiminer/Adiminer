import axios from 'axios';
import {
  localSolve,
  localHistory,
  localGet,
  localSave,
  localDelete,
  localClear,
} from './localEngine';

// When VITE_API_URL is set, Miraa talks to the Express/MongoDB backend and
// falls back to the in-browser engine if the server can't be reached.
// When it is not set, Miraa runs fully in the browser (static website mode).
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const isStandalone = () => !API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const err = new Error(error.response?.data?.message || error.message || 'An error occurred');
    err.isNetworkError = !error.response;
    return Promise.reject(err);
  }
);

// Try the backend, and on a network failure use the local engine instead.
const withFallback = async (remote, local) => {
  if (isStandalone()) return local();
  try {
    return await remote();
  } catch (err) {
    if (err.isNetworkError) return local();
    throw err;
  }
};

const preview = (answer) => (answer.length > 100 ? `${answer.slice(0, 100)}...` : answer);

export const solveProblem = (problemData) =>
  withFallback(
    () => api.post('/solve', problemData),
    () => {
      const record = localSolve(problemData);
      return {
        success: true,
        data: {
          problemId: record.id,
          problem: record.text,
          solution: record.solution.answer,
          steps: record.solution.steps,
          confidence: record.solution.confidence,
          subject: record.solution.subject,
          local: true,
        },
      };
    }
  );

export const getHistory = () =>
  withFallback(
    () => api.get('/history'),
    () => ({
      success: true,
      data: localHistory().map((r) => ({
        id: r.id,
        text: r.text,
        type: r.type,
        createdAt: r.createdAt,
        solutionPreview: preview(r.solution.answer),
        confidence: r.solution.confidence,
        subject: r.solution.subject,
        local: true,
      })),
    })
  );

export const getProblemDetails = (id) =>
  withFallback(
    () => api.get(`/history/${id}`),
    () => {
      const r = localGet(id);
      if (!r) return { success: false, message: 'Problem not found' };
      return {
        success: true,
        data: {
          problem: { id: r.id, text: r.text, type: r.type, createdAt: r.createdAt },
          solution: { ...r.solution, createdAt: r.createdAt },
        },
      };
    }
  );

export const saveToHistory = (problemId) =>
  withFallback(
    () => api.post('/history', { problemId }),
    () =>
      localSave(problemId)
        ? { success: true }
        : { success: false, message: 'Problem not found' }
  );

// Local-only helpers (history stored in this browser)
export const deleteFromHistory = (id) => {
  localDelete(id);
  return { success: true };
};

export const clearHistory = () => {
  localClear();
  return { success: true };
};

export const checkHealth = () =>
  withFallback(
    () => api.get('/health'),
    () => ({ success: true, message: 'Miraa is running in standalone mode' })
  );

export default api;
