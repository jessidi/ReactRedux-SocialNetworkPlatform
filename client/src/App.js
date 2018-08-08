import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";

import store from "./store";
import { Provider } from "react-redux";

import PrivateRoute from "./components/common/PrivateRoute";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/create-profile/CreateProfile";
import EditProfile from "./components/edit-profile/EditProfile";
import "./App.css";
import AddExperience from "./components/add-credentials/AddExperience";
import AddEducation from "./components/add-credentials/AddEducation";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import NotFound from "./components/not-found/NotFound";
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
    //clear current profile
    store.dispatch(clearCurrentProfile());

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
              <Route path="/profiles" component={Profiles} exact />
              <Route path="/profile/:handle" component={Profile} exact />
              <Switch>
                <PrivateRoute path="/dashboard" component={Dashboard} exact />
              </Switch>
              <Switch>
                <PrivateRoute
                  path="/create-profile"
                  component={CreateProfile}
                  exact
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  path="/edit-profile"
                  component={EditProfile}
                  exact
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  path="/add-experience"
                  component={AddExperience}
                  exact
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  path="/add-education"
                  component={AddEducation}
                  exact
                />
              </Switch>
              <Route path="/not-found" component={NotFound} exact />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
