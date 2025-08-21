import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { AutoComplete } from "@progress/kendo-react-dropdowns";
import { Diff, parseDiff } from 'react-diff-view'; // <-- Import the library
import 'react-diff-view/style/index.css'; // <-- Import its CSS
import './ChatPane.css';

const ChatPane = ({ messages, onSendMessage, onStartInspection }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  
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

  // This is the new component for rendering a diff
  const DiffViewer = ({ diffText }) => {
    if (!diffText) return null;
    const files = parseDiff(diffText); // The library provides this parsing function
    
    return files.map((file, index) => (
      <Diff key={index} viewType="split" diffType={file.type} hunkFormat="github">
        {file.hunks.map(hunk => <div key={hunk.content}>{hunk.content}</div>)}
      </Diff>
    ));
  };

  return (
    <aside className="chat-pane">
      <div className="chat-header">
        <h3>🤖 GenAI Assistant</h3>
      </div>
      <div className="chat-body">
        {messages.map((msg, index) => {
          // Check the message type and render accordingly
          if (msg.type === 'diff') {
            return (
              <div key={index} className="diff-container">
                <DiffViewer diffText={msg.diffText} />
                <Button 
                  icon="copy" 
                  onClick={() => navigator.clipboard.writeText(msg.newCode)}
                  className="copy-button"
                >
                  Copy New Code
                </Button>
              </div>
            );
          }
          // Default rendering for text-based messages
          return (
            <div key={index} className={`chat-message ${msg.type}`}>
              <p>{msg.text}</p>
            </div>
          );
        })}
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
