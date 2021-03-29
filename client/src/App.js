import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect,
  useHistory
} from "react-router-dom";
import Login from "./components/Login.js";
import ChatRoom from "./components/ChatRoom.js";

const App = () => {
  const [user, setUser] = useState('')

  return (
    <Router>
      <Switch>
        {/* <Route exact path="/login" component={() => <Login user={user} setUser={setUser} />} /> */}
        <Route exact path="/" >
          {user ? <Redirect to='/chat' /> : <Login setUser={setUser} />}
        </Route>
        <Route exact path='/chat' component={() => <ChatRoom user={user} />} />
      </Switch>
    </Router>
  );
};

export default App;
