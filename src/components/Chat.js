import React, { useState } from 'react';
import axios from 'axios';
import ChatInput from './ChatInput';
import Message from './Message';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);

  const sendMessage = async (message) => {
    const userMessage = { text: message, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_AZURE_OPENAI_ENDPOINT}/api/threads`,
        {
          content: message,
          role: 'user'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_AZURE_OPENAI_API_KEY}`
          }
        }
      );

      const botMessage = { text: response.data.reply, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { text: 'Sorry, there was an error processing your request.', sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  const handleSuggestionClick = (message) => {
    sendMessage(message);
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
      </div>
      <div className="suggestions">
        <button onClick={() => handleSuggestionClick('How much EMI do I need to pay?')}>How much EMI do I need to pay?</button>
        <button onClick={() => handleSuggestionClick('I need financial advice')}>I need financial advice</button>
      </div>
      <ChatInput sendMessage={sendMessage} />
    </div>
  );
};

export default Chat;
