import React, { useState, useEffect } from "react";
import MessageList from "./MessageList";
import io from "socket.io-client";

import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  makeStyles,
} from "@material-ui/core";

const ChatRoom = () => {
  // const SERVER = "https://chat-app-server-chicchon.herokuapp.com/"; /// deployment
  const SERVER = "http://10.0.0.119:5000";
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [numUsers, setNumUsers] = useState(0);
  useEffect(() => {
    console.log("Start Client");
    initializeSocket();
    // return socket.disconnect();
  }, []);

  // initialize connection
  const initializeSocket = () => {
    // console.log("Connect to Heroku Server");
    let newSocket = io(SERVER);
    setSocket(newSocket);
    // When new user connects, send data
    newSocket.on("new-user", (data) => {
      console.log("A user connected to the server");
      console.log("Current Users:", data["users"]);
      console.log("Messages:", data["messages"]);
      setMessageList(data["messages"]);
      setNumUsers(data["users"]);
      setLoading(false);
    });
    // Receiving message from server
    newSocket.on("user-disconnected", (users) => {
      console.log("A user disconnected");
      console.log("Current Users:", users);
      setNumUsers(users);
    });
    newSocket.on("receiving-message", (message) => {
      console.log(message);
      setMessageList((messageList) => [...messageList, message]);
    });

    // return newSocket.close();
  };
  const sendMessage = () => {
    if (newMessage.length === 0) {
      console.log("Message must be at least 1 character");
      return;
    }
    // console.log(newMessage);

    socket.emit("send-message", {
      text: newMessage,
      date: new Date(),
      sender: "Danny",
    });
    setNewMessage("");
  };
  const useStyles = makeStyles((theme) => ({
    container: {
      spacing: 2,
      marginTop: "50px",
    },
    paper: {
      maxHeight: 400,
      overflow: "auto",
      marginTop: "50px",
    },
    inputMessage: {
      marginTop: "25px",
    },
  }));

  const classes = useStyles();

  return (
    <Container maxWidth="md" className={classes.container}>
      <Typography variant="h3">Chat App</Typography>
      <Typography variant="h6">Current Users {numUsers}</Typography>

      <div className={classes.inputMessage}>
        <TextField
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          label="Message"
        />
        <Button onClick={sendMessage} color="primary" variant="contained">
          Send
        </Button>
      </div>
      <Paper className={classes.paper} elevation={3}>
        <MessageList messages={messageList} loading={loading} />
      </Paper>
    </Container>
  );
};

export default ChatRoom;
