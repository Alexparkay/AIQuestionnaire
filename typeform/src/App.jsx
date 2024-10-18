import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Form from './Form';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Form />} />
      </Routes>
    </div>
  );
}

export default App;
