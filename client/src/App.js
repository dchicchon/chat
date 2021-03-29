import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect,
} from "react-router-dom";
import Login from "./components/Login.js";
import ChatRoom from "./components/ChatRoom.js";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/" component={ChatRoom} />
      </Switch>
    </Router>
  );
};

export default App;
