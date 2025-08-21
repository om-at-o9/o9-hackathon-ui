import React from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to the o9 Hackathon!</h1>
      <p>This is a prototype of a GenAI-powered Developer Assistant.</p>
      <Button primary={true} onClick={() => navigate('/listbox')}>
        Go to Demo
      </Button>
    </div>
  );
};

export default HomePage;