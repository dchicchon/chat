import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/Login.js";
import ChatRoom from "./components/ChatRoom.js";

const App = () => {
  const [user, setUser] = useState("");

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user ? <ChatRoom user={user} /> : <Login setUser={setUser} />}
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
