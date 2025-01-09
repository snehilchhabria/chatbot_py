import React, { useState, useEffect } from 'react';

const ChatGPTClone = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8000/ws');

    websocket.onopen = () => {
      console.log('WebSocket connection established');
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: event.data },
      ]);
    };

    websocket.onerror = (err) => {
      console.error('WebSocket error:', err);
      alert('Unable to connect to the server. Please check your WebSocket setup.');
    };

    websocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => websocket.close();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && ws?.readyState === WebSocket.OPEN) {
      setMessages((prev) => [...prev, { role: 'user', content: input }]);
      ws.send(input);
      setInput('');
    } else {
      alert('WebSocket is not connected. Unable to send messages.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-between">
      <h1 className="text-center text-3xl font-semibold py-6">ChatGPT Clone</h1>

      {/* Messages Section */}
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 p-4 rounded-lg max-w-4xl mx-auto ${
                message.role === 'assistant' ? 'bg-gray-700' : 'bg-indigo-700'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                  message.role === 'assistant' ? 'bg-green-600' : 'bg-blue-600'
                }`}
              >
                {message.role === 'assistant' ? 'A' : 'U'}
              </div>
              <div className="flex-grow">{message.content}</div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400">
            No messages yet. Start the conversation!
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="p-4 bg-gray-800 border-t border-gray-600">
        <form onSubmit={handleSubmit} className="flex items-center max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </form>
      </div>
    </div>
  );
};

export default ChatGPTClone;
