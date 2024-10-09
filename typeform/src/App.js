import React from 'react';
import Form from './Form';
import ErrorBoundary from './ErrorBoundary';
import './App.css';

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <Form />
      </ErrorBoundary>
    </div>
  );
}

export default App;

