import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Game from './components/Game';
import Auth from './components/Auth';
import axios from 'axios';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Fetch user data here
    }
  }, []);

  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        user ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );

  return (
    <Router>
      <div className="app">
        <Route path="/login" render={() => <Auth setUser={setUser} />} />
        <PrivateRoute path="/game" component={Game} />
        <Redirect from="/" to="/game" />
      </div>
    </Router>
  );
};

export default App;