import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ListBoxPage from './pages/ListBoxPage';
import CounterPage from './pages/CounterPage';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listbox" element={<ListBoxPage />} />
          <Route path="/counter" element={<CounterPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;