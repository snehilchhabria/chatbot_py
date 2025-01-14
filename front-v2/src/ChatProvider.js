// ChatProvider.js
import React, { createContext, useContext, useReducer } from 'react';

const API_URL = 'http://localhost:8000'; // Backend API URL

// Actions
const Actions = {
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_TOKEN: 'SET_TOKEN',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  SET_LOADING: 'SET_LOADING',
};

// Reducer to manage state
const chatReducer = (state, action) => {
  switch (action.type) {
    case Actions.ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
    case Actions.SET_TOKEN:
      return { ...state, token: action.payload, isAuthenticated: !!action.payload };
    case Actions.LOGOUT:
      return { ...state, token: null, isAuthenticated: false, messages: [] };
    case Actions.SET_ERROR:
      return { ...state, error: action.payload };
    case Actions.SET_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

// Create context
const ChatContext = createContext(null);

// ChatProvider (Context Provider)
const ChatProvider = ({ children }) => {
  const initialState = {
    messages: [],
    token: null,
    isAuthenticated: false,
    error: '',
    isLoading: false,
  };

  const [state, dispatch] = useReducer(chatReducer, initialState);

  const setToken = (token) => dispatch({ type: Actions.SET_TOKEN, payload: token });
  const addMessage = (message) => dispatch({ type: Actions.ADD_MESSAGE, payload: message });
  const logout = () => dispatch({ type: Actions.LOGOUT });
  const setError = (error) => dispatch({ type: Actions.SET_ERROR, payload: error });
  const setLoading = (isLoading) => dispatch({ type: Actions.SET_LOADING, payload: isLoading });

  const login = async (username, password) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        credentials: 'include',
      });
      const data = await response.json();

      if (response.ok) {
        setToken(data.access_token);
      } else {
        setError(data.detail || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message) => {
    if (!message.trim()) return;
    addMessage({ role: 'user', content: message });
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
        body: JSON.stringify({ content: message }),
      });
      const data = await response.json();
      addMessage({ role: 'assistant', content: data.response });
    } catch (error) {
      addMessage({ role: 'assistant', content: 'Sorry, there was an error processing your request.' });
    }
  };

  const value = {
    ...state,
    login,
    sendMessage,
    logout,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Custom hook to use the context
const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};

export { ChatProvider, useChat };
