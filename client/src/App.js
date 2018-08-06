import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import store from "./store";
import { Provider } from "react-redux";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import "./App.css";

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header authorization
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and is authenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expirede token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    //TODO: clear current profile
    //Redirect to login
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route path="/" component={Landing} exact />
            <div className="container">
              <Route path="/register" component={Register} exact />
              <Route path="/login" component={Login} exact />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
