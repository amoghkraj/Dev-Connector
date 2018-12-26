import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import store from "./store";
import { Provider } from "react-redux";
import setTokenToReqHeader from "./utils/setTokenToReqHeader";
import jwt_decode from "jwt-decode";
import { setCurrentUser, logoutUser } from "./actions/authActions";

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setTokenToReqHeader(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // TODO: Clear current Profile

    // Redirect to login
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">
            <Navbar />
            <Route path="/" component={Landing} exact />
            <div className="container">
              <Route path="/login" component={Login} exact />
              <Route path="/register" component={Register} exact />
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
