import React, { useState } from 'react';
import chatbotIcon from '../assets/chatbot.png';

const ChatbotSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    try {
      const response = await fetch("/api/chatbot/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages([...newMessages, { sender: "bot", text: data.response }]);
      } else {
        setMessages([...newMessages, { sender: "bot", text: "Something went wrong. Please try again." }]);
      }
    } catch (error) {
      setMessages([...newMessages, { sender: "bot", text: "Error: Unable to reach the server." }]);
    }

    setInput("");
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed bottom-4 right-4 z-50 w-14 h-14 bg-transparent transition-transform duration-300 ${
          isOpen ? 'translate-x-[-320px]' : 'translate-x-0'
        }`}
      >
        <img src={chatbotIcon} alt="" className="w-full h-full object-contain" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-lg font-semibold">Chatbot</h2>
            <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-md ${
                  msg.sender === "bot" ? "bg-gray-100 text-gray-800" : "bg-blue-500 text-white self-end"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="mt-auto">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600 transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default ChatbotSidebar;
