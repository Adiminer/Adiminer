import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  currentProblem: null,
  currentSolution: null,
  history: [],
  loading: false,
  error: null,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_CURRENT_PROBLEM':
      return { ...state, currentProblem: action.payload };
    case 'SET_CURRENT_SOLUTION':
      return { ...state, currentSolution: action.payload, loading: false };
    case 'SET_HISTORY':
      return { ...state, history: action.payload };
    case 'ADD_TO_HISTORY':
      return { ...state, history: [action.payload, ...state.history] };
    case 'CLEAR_CURRENT':
      return { ...state, currentProblem: null, currentSolution: null };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const setCurrentProblem = (problem) => {
    dispatch({ type: 'SET_CURRENT_PROBLEM', payload: problem });
  };

  const setCurrentSolution = (solution) => {
    dispatch({ type: 'SET_CURRENT_SOLUTION', payload: solution });
  };

  const setHistory = (history) => {
    dispatch({ type: 'SET_HISTORY', payload: history });
  };

  const addToHistory = (item) => {
    dispatch({ type: 'ADD_TO_HISTORY', payload: item });
  };

  const clearCurrent = () => {
    dispatch({ type: 'CLEAR_CURRENT' });
  };

  const value = {
    ...state,
    setLoading,
    setError,
    clearError,
    setCurrentProblem,
    setCurrentSolution,
    setHistory,
    addToHistory,
    clearCurrent,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};