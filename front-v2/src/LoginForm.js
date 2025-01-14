// LoginForm.js
import React, { useState } from 'react';
import { useChat } from './ChatProvider'; // Assuming the hook is in ChatProvider.js

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useChat();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-500">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign in to ChatBot</h2>
        </div>
        {error && <Alert>{error}</Alert>}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <input
                type="text"
                required
                className="relative block w-full rounded-md border border-gray-300 p-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="relative block w-full rounded-md border border-gray-300 p-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

// Alert component to show error messages
const Alert = ({ children }) => (
  <div className="rounded-md bg-red-500 text-white p-2 mb-4">
    <strong>Error:</strong> {children}
  </div>
);

export default LoginForm;
