import React, { useState, useEffect } from 'react';
import Chatbot from 'react-chatbot-kit';
import axios from 'axios';
import '../styles/chatbot.css';
import BotImg from "../assets/chatbot.png"

// Config object
const config = {
  initialMessages: [
    {
      type: 'bot',
      message: 'Hello! I am your HR Assistant. You can ask me questions about staff, projects, or upload documents for me to learn from.'
    }
  ],
  botName: 'HR Assistant',
};

// MessageParser class
class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    // Send message to RAG system
    this.actionProvider.handleRagQuery(message);
  }
}

// ActionProvider class
class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  async handleRagQuery(message) {
    try {
      // Show typing indicator
      const loadingMessage = this.createChatBotMessage("Thinking...", {
        loading: true,
      });
      this.updateChatbotState(loadingMessage);

      // Send query to backend
      const response = await axios.post('http://localhost:8000/api/rag/query/', {
        question: message
      });

      // Remove loading message
      this.setState((prevState) => ({
        ...prevState,
        messages: prevState.messages.filter(msg => !msg.loading),
      }));

      // Display answer
      const answerMessage = this.createChatBotMessage(response.data.answer);
      this.updateChatbotState(answerMessage);

      // Display sources if available
      if (response.data.sources && response.data.sources.length > 0) {
        const sourcesMessage = this.createChatBotMessage(
          "Sources used:\n" + response.data.sources.map((source, index) => 
            `${index + 1}. ${source.source}`
          ).join('\n'),
          {
            type: 'sources'
          }
        );
        this.updateChatbotState(sourcesMessage);
      }
    } catch (error) {
      console.error('RAG query error:', error);
      const errorMessage = this.createChatBotMessage(
        "I'm sorry, I encountered an error processing your question. Please try again later."
      );
      this.updateChatbotState(errorMessage);
    }
  }

  updateChatbotState(message) {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  }
}

const CustomChatbot = () => {
  const [showBot, setShowBot] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [fileUploadStatus, setFileUploadStatus] = useState(null);

  // File upload handler
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create loading message in chat
    const loadingMessage = {
      type: 'bot',
      message: `Uploading ${file.name}...`
    };
    setChatHistory(prev => [...prev, loadingMessage]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setFileUploadStatus('uploading');
      const response = await axios.post('http://localhost:8000/api/documents/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFileUploadStatus('success');
      
      // Remove loading message and add success message
      setChatHistory(prev => {
        const filteredHistory = prev.filter(msg => msg !== loadingMessage);
        return [...filteredHistory, {
          type: 'bot',
          message: `Successfully uploaded ${file.name}. You can now ask questions about its contents!`
        }];
      });

      // Clear the file input
      event.target.value = '';

    } catch (error) {
      console.error('Upload error:', error);
      setFileUploadStatus('error');
      
      // Remove loading message and add error message
      setChatHistory(prev => {
        const filteredHistory = prev.filter(msg => msg !== loadingMessage);
        return [...filteredHistory, {
          type: 'bot',
          message: `Error uploading file: ${error.response?.data?.error || 'Unknown error'}`
        }];
      });

      // Clear the file input
      event.target.value = '';
    }
  };

  // Create a custom message handler
  const handleMessage = (message) => {
    setChatHistory(prevHistory => [...prevHistory, message]);
  };

  // Modified config to include saved messages
  const configWithHistory = {
    ...config,
    initialMessages: [...config.initialMessages, ...chatHistory],
    customComponents: {
      botMessageParser: (message) => {
        handleMessage(message);
        return message;
      },
      userMessageParser: (message) => {
        handleMessage(message);
        return message;
      },
    },
  };

  return (
    <div className="relative">
      {showBot && (
        <div className="fixed bottom-24 right-4 z-50 w-[380px] shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ease-in-out bg-white">
          <div className="bg-custom-purple-600 p-4 flex justify-between items-center">
            <h2 className="text-white font-semibold text-lg">HR Assistant (Bot)</h2>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer relative">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.txt,.xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={fileUploadStatus === 'uploading'}
                />
                {fileUploadStatus === 'uploading' ? (
                  <svg 
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 ${
                      fileUploadStatus === 'success' ? 'text-green-200' : 
                      fileUploadStatus === 'error' ? 'text-red-200' : 
                      'text-white'
                    } hover:text-gray-200`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 4v16m8-8H4" 
                    />
                  </svg>
                )}
              </label>
            </div>
          </div>
          
          <div className="bg-white">
            {fileUploadStatus === 'uploading' && (
              <div className="p-2 bg-blue-100 text-blue-700 text-sm">
                Uploading file...
              </div>
            )}
            <Chatbot
              config={configWithHistory}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
              className="!bg-transparent"
              messageHistory={chatHistory}
            />
          </div>
        </div>
      )}
      
      {/* Toggle button */}
      <button
        className="fixed bottom-6 right-6 bg-custom-purple-300 text-white p-3.5 rounded-full shadow-lg hover:bg-custom-purple-400 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-custom-purple-500 focus:ring-offset-2"
        onClick={() => setShowBot(!showBot)}
        aria-label={showBot ? 'Close chat' : 'Open chat'}
      >
        {showBot ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <img src={BotImg} alt="botimg" className='h-7 w-7' />
        )}
      </button>
    </div>
  );
};

export default CustomChatbot;