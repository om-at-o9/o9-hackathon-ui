import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { AutoComplete } from "@progress/kendo-react-dropdowns";
import './ChatPane.css'; // We will update this file

const ChatPane = ({ messages, onSendMessage, onStartInspection }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  
  // Automatically scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <aside className="chat-pane">
      <div className="chat-header">
        <h3>🤖 GenAI Assistant</h3>
      </div>

      <div className="chat-body">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-footer">
        <Button icon="zoom" onClick={onStartInspection} title="Inspect Element">
          Inspect
        </Button>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexGrow: 1, marginLeft: '8px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question..."
          />
          <Button type="submit" primary={true} style={{ marginLeft: '4px' }}>Send</Button>
        </form>
      </div>
    </aside>
  );
};

export default ChatPane;