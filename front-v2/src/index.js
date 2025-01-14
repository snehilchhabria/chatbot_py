// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChatProvider } from './ChatProvider'; // Import ChatProvider

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ChatProvider> {/* Wrap the root component with ChatProvider */}
    <App />
  </ChatProvider>
);
