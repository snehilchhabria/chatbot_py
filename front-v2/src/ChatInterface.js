// ChatInterface.js
import React, { useState } from 'react';
import { useChat } from './ChatProvider'; // Assuming the hook is in ChatProvider.js

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
      <div className="flex items-center justify-between bg-blue-600 p-4 shadow-lg text-white">
        <h1 className="text-xl font-bold">ChatBot</h1>
        <button onClick={logout} className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
          Logout
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg px-4 py-2 ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} max-w-[70%] shadow-lg`}>
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="border-t bg-white p-4 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 p-2"
          placeholder="Type your message..."
        />
        <button type="submit" className="ml-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
