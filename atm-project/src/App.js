import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ATMMachine from './components/ATMMachine';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ATMMachine />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
