import React, { useState, useEffect } from 'react';
import Chatbot from 'react-chatbot-kit';
import '../styles/chatbot.css';
import BotImg from "../assets/chatbot.png"

// Config object
const config = {
  initialMessages: [
    {
      type: 'bot',
      message: 'Hello! How can I help you today?'
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
    const lowerCase = message.toLowerCase();
    
    if (lowerCase.includes('attendance')) {
      this.actionProvider.handleAttendance();
    } else if (lowerCase.includes('project')) {
      this.actionProvider.handleProjects();
    } else if (lowerCase.includes('person') || lowerCase.includes('people')) {
      this.actionProvider.handlePersons();
    } else {
      this.actionProvider.handleDefault();
    }
  }
}

// ActionProvider class
class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleAttendance() {
    const message = this.createChatBotMessage(
      'To view attendance, click on the "Select Member" dropdown in the sidebar and choose a team member.'
    );
    this.updateChatbotState(message);
  }

  handleProjects() {
    const message = this.createChatBotMessage(
      'To edit projects, click on "Edit Projects" in the sidebar under Data Options.'
    );
    this.updateChatbotState(message);
  }

  handlePersons() {
    const message = this.createChatBotMessage(
      'To edit persons, click on "Edit Persons" in the sidebar under Data Options.'
    );
    this.updateChatbotState(message);
  }

  handleDefault() {
    const message = this.createChatBotMessage(
      "I'm not sure how to help with that. Could you try rephrasing or ask another question?"
    );
    this.updateChatbotState(message);
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

  // Create a custom message handler
  const handleMessage = (message) => {
    setChatHistory(prevHistory => [...prevHistory, message]);
  };

  // Modified config to include saved messages
  const configWithHistory = {
    ...config,
    initialMessages: [...config.initialMessages, ...chatHistory],
    customComponents: {
      // This will handle new messages
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
          <div className="bg-custom-purple-600 p-4">
            <h2 className="text-white font-semibold text-lg">HR Assistant (Bot)</h2>
          </div>
          
          <div className="bg-white">
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