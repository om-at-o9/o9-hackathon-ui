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

  // Callback from inspector hook when element is selected
  const handleElementSelected = (descriptor) => {
    addMessage(`Context set to: ${descriptor}`, 'bot-context');
  };

  // Use custom hook for inspection
  const { startInspection } = useInspector({ onElementSelected: handleElementSelected });

  // Add message helper
  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, { text, sender }]);
  };

  // Send message handler (simulated bot response)
  const handleSendMessage = (userText) => {
    addMessage(userText, 'user');

    setTimeout(() => {
      addMessage('Thinking...', 'bot');

      setTimeout(() => {
        setMessages(prev => prev.slice(0, -1)); // Remove 'Thinking...'
        addMessage(
          `This is a simulated response about: "${userText}". In a real app, I would analyze the code context and provide a real answer.`,
          'bot'
        );
      }, 1500);
    }, 500);
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
          style={{ marginBottom: '20px' }}
        >
          Export Data
        </Button>

        {/* The data-source-loc attribute for inspection */}
        <div className="listbox-grid" data-source-loc="src/pages/ListBoxPage.jsx:75">
          <div className="listbox-column">
            <h3>Employees</h3>
            <ListBox
              style={{ height: 400, width: '100%' }}
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
