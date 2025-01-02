import React, { useState } from 'react';

const ChatbotSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600 transition"
      >
        {isOpen ? 'Close Chat' : 'Open Chat'}
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
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto mb-4">
            {/* Example chatbot messages */}
            <div className="space-y-4">
              <div className="bg-gray-100 p-3 rounded-md text-gray-800">
                Hello! How can I assist you today?
              </div>
              <div className="bg-blue-500 text-white p-3 rounded-md self-end">
                I need help with my account.
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="mt-auto">
            <form className="flex items-center space-x-2">
              <input
                type="text"
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
