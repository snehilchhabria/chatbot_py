import React, { useState, useReducer, useContext, createContext } from 'react';
import ReactDOM from 'react-dom/client'; // Updated import to 'react-dom/client'

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

  // API call function for login
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

  // API call function for chat
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
      console.error('Chat error:', error);
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
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// LoginForm component
const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useChat();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight">Sign in to ChatBot</h2>
        </div>
        {error && <Alert>{error}</Alert>}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <input
                type="text"
                required
                className="relative block w-full rounded-md border p-2"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="relative block w-full rounded-md border p-2"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500'}`}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600">
          Test credentials:<br />
          Username: testuser<br />
          Password: testpass
        </div>
      </div>
    </div>
  );
};

// ChatInterface component
const ChatInterface = () => {
  const [input, setInput] = useState('');
  const { messages, sendMessage, token, logout } = useChat();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <div className="flex items-center justify-between bg-white p-4 shadow">
        <h1 className="text-xl font-bold">ChatBot</h1>
        <button onClick={logout} className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
          Logout
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg px-4 py-2 ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'} max-w-[70%] shadow`}>
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="border-t bg-white p-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-lg border p-2"
            placeholder="Type your message..."
          />
          <button type="submit" className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

// Alert component to show error messages
const Alert = ({ children }) => (
  <div className="rounded-md bg-red-500 text-white p-2 mb-4">
    <strong>Error:</strong> {children}
  </div>
);

// Main App component
const App = () => {
  const { isAuthenticated } = useChat();

  return (
    <div>
      {isAuthenticated ? <ChatInterface /> : <LoginForm />}
    </div>
  );
};

// Use createRoot instead of ReactDOM.render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChatProvider>
    <App />
  </ChatProvider>
);
