import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Form from './Form';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Form} />
        <Route path="*" component={Form} /> {/* Add this line */}
      </Switch>
    </Router>
  );
}

export default App;