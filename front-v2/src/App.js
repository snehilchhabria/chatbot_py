// App.js
import React from 'react';
import { ChatProvider } from './ChatProvider'; // Import ChatProvider
import ChatInterface from './ChatInterface';
import LoginForm from './LoginForm';

const App = () => {
  return (
    <ChatProvider> {/* Wrap the app with ChatProvider */}
      <div>
        <LoginForm /> {/* or ChatInterface based on the state */}
      </div>
    </ChatProvider>
  );
};

export default App;
