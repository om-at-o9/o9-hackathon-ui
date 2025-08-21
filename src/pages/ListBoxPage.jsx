import React, { useState } from 'react';
import {
  ListBox,
  ListBoxToolbar,
  processListBoxData,
  processListBoxDragAndDrop
} from '@progress/kendo-react-listbox';
import ChatPane from '../components/ChatPane';
import { useInspector } from '../hooks/useInspector'; // Your custom hook
import { Button } from '@progress/kendo-react-buttons';
import './ListBoxPage.css';

const initialData = [
  { name: 'Steven White', selected: true },
  { name: 'Nancy King', selected: false },
  { name: 'Nancy Davolio', selected: false },
  { name: 'Robert Davolio', selected: false },
  { name: 'Michael Leverling', selected: false },
  { name: 'Andrew Callahan', selected: false },
  { name: 'Michael Suyama', selected: false }
];

const SELECTED_FIELD = 'selected';

const ListBoxPage = () => {
  // Kendo ListBox state
  const [state, setState] = useState({
    employees: initialData,
    developers: [],
    draggedItem: {}
  });

  // Chat messages state
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I'm your GenAI assistant. Click 'Inspect' to select a UI element or ask me a question about the code."
    }
  ]);

  const [selectedContext, setSelectedContext] = useState('');

  // Callback from inspector hook when element is selected
  const handleElementSelected = (descriptor) => {
    const contextMessage = `Context set to: ${descriptor}`;
    addMessage(contextMessage, 'bot-context');
    setSelectedContext(descriptor); // Save the context
};
  // Use custom hook for inspection
  const { startInspection } = useInspector({ onElementSelected: handleElementSelected });

  // Add message helper
  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, { text, sender }]);
  };

  // Send message handler (simulated bot response)
  const handleSendMessage = async (userText) => {
    addMessage(userText, 'user');
    addMessage('Analyzing request...', 'bot');

    try {
        const response = await fetch('http://localhost:3001/api/modify-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: userText,
                context: selectedContext // Send the saved context
            }),
        });

        const result = await response.json();

        // In the next steps, we'll handle displaying the result.
        // For now, let's just log it.
        console.log(result);
        addMessage(`AI Suggestion: ${result.explanation}`, 'bot');

    } catch (error) {
        console.error('Error modifying code:', error);
        addMessage('Sorry, something went wrong.', 'bot');
    }
};

  // Kendo ListBox handlers
  const handleItemClick = (event, dataField, connectedField) => {
    setState((prevState) => ({
      ...prevState,
      [dataField]: prevState[dataField].map(item => {
        if (item.name === event.dataItem.name) {
          item[SELECTED_FIELD] = !item[SELECTED_FIELD];
        } else if (!event.nativeEvent.ctrlKey) {
          item[SELECTED_FIELD] = false;
        }
        return item;
      }),
      [connectedField]: prevState[connectedField].map(item => {
        item[SELECTED_FIELD] = false;
        return item;
      })
    }));
  };

  const handleToolBarClick = (e) => {
    const toolName = e.toolName || '';
    const result = processListBoxData(
      state.employees,
      state.developers,
      toolName,
      SELECTED_FIELD
    );
    setState({
      ...state,
      employees: result.listBoxOneData,
      developers: result.listBoxTwoData
    });
  };

  const handleDragStart = (e) => {
    setState({
      ...state,
      draggedItem: e.dataItem
    });
  };

  const handleDrop = (e) => {
    const result = processListBoxDragAndDrop(
      state.employees,
      state.developers,
      state.draggedItem,
      e.dataItem,
      'name'
    );
    setState({
      ...state,
      employees: result.listBoxOneData,
      developers: result.listBoxTwoData
    });
  };

  return (
    <div className="page-container">
      <div className="main-content">
        <h2>Kendo ListBox - Employees vs Developers</h2>
        <p>This is an example of a component developers might need to debug or modify.</p>

        <Button 
          icon="download" 
          primary={true} 
          onClick={() => console.log('Export button clicked!')}
          style={{ marginBottom: '21px' }}
          data-source-loc="src/pages/ListBoxPage.jsx:148"
        >
          Export Data
        </Button>

        {/* The data-source-loc attribute for inspection */}
        <div className="listbox-grid" data-source-loc="src/pages/ListBoxPage.jsx:75">
          <div className="listbox-column">
            <h3>Employees</h3>
            <ListBox
              style={{ height: 405, width: '100%' }}
              data={state.employees}
              textField="name"
              selectedField={SELECTED_FIELD}
              onItemClick={(e) => handleItemClick(e, 'employees', 'developers')}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              toolbar={() => (
                <ListBoxToolbar
                  tools={[
                    'moveUp',
                    'moveDown',
                    'transferTo',
                    'transferFrom',
                    'transferAllTo',
                    'transferAllFrom',
                    'remove'
                  ]}
                  data={state.employees}
                  dataConnected={state.developers}
                  onToolClick={handleToolBarClick}
                />
              )}
            />
          </div>
          <div className="listbox-column">
            <h3>Developers</h3>
            <ListBox
              style={{ height: 400, width: '100%' }}
              data={state.developers}
              textField="name"
              selectedField={SELECTED_FIELD}
              onItemClick={(e) => handleItemClick(e, 'developers', 'employees')}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
            />
          </div>
        </div>
      </div>

      <ChatPane
        messages={messages}
        onSendMessage={handleSendMessage}
        onStartInspection={startInspection}
      />
    </div>
  );
};

export default ListBoxPage;
