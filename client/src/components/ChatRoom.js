import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import {
  Container,
  Typography,
  TextField,
  Button,
  makeStyles,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from "@material-ui/core";

const MessageList = (props) => {
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const useStyles = makeStyles((theme) => ({
    message: {
      width: "fit-content",
      alignSelf: "flex-start",
    },
    ghostMessageHeader: {
      height: "46px",
    },
    ghostMessage: {
      height: "56px",
    },
    messageDate: {
      fontSize: "11px",
      marginLeft: "5px",
      color: "grey",
    },
    messageText: {
      color: "black",
    },
    list: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "auto",
    },
  }));

  const classes = useStyles();
  useEffect(() => {
    // console.log("Rerender Message list");
    scrollToBottom();
  }, [props.messages]);

  let list = props.messages;
  list = list.map((m, i) => (
    <ListItem key={i} className={classes.message}>
      <ListItemText
        primary={
          <React.Fragment>
            <Typography component="span">{m.sender}</Typography>
            <Typography className={classes.messageDate} component="span">
              {" "}
              {m.date}
            </Typography>
          </React.Fragment>
        }
        secondary={
          <Typography className={classes.messageText}>{m.text}</Typography>
        }
      />
    </ListItem>
  ));
  return (
    <List className={classes.list} disablePadding={true}>
      <div className={classes.ghostMessageHeader} />
      {props.loading ? <CircularProgress /> : list}
      <div className={classes.ghostMessage} ref={messagesEndRef} />
    </List>
  );
};

const ChatRoom = (props) => {
  const SERVER = "https://chat-app-server-chicchon.herokuapp.com/"; /// deployment
  // const SERVER = 'http://localhost:5000'
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [numUsers, setNumUsers] = useState(0);
  const inputMessageRef = useRef(null); // used to scroll to bottom of messages

  useEffect(() => {
    initializeSocket();
  }, []);

  // initialize connection
  const initializeSocket = () => {
    // console.log("Connect to Heroku Server");
    let newSocket = io(SERVER, {
      query: {
        user: props.user
      }
    });
    setSocket(newSocket);
    // When new user connects, send data
    newSocket.on("new-user", (data) => {
      // console.log(data)
      setMessageList(data["messages"]);
      setNumUsers(data["users"]);
      setLoading(false);
    });
    // Receiving message from server
    newSocket.on("user-disconnected", (data) => {
      setNumUsers(data['users']);
      setMessageList(data['messages'])
    });
    // Add Message to our current list
    newSocket.on("receiving-message", (messages) => {
      setMessageList(messages);
    });
  };

  const sendMessage = () => {
    if (newMessage.length === 0) {
      console.log("Message must be at least 1 character");
      return;
    }

    socket.emit("send-message", {
      text: newMessage,
      date: new Date().toDateString(),
      sender: props.user,
    });
    inputMessageRef.current.focus();
    setNewMessage("");
  };

  const useStyles = makeStyles((theme) => ({
    header: {
      marginLeft: "25px",
    },
    heading: {
      position: "fixed",
      top: "0",
      background: "white",
      paddingTop: "10px",
      zIndex: "100",
      width: "100%",
    },
    container: {
      marginTop: "10px",
      position: "relative",
      padding: 0,
    },
    userNum: {
      marginLeft: "25px",
    },
    messageList: {
      position: "relative",
    },
    inputMessage: {
      padding: "0",
      position: "fixed",
      background: "white",
      zIndex: "100",
      bottom: "0",
      width: "100%",
    },
    input: {
      width: "80%",
    },
    button: {
      width: "20%",
      height: "56px",
    },
  }));


  const handleMessage = (e) => {
    e.preventDefault()
    // console.log("Typing in Input")
    setNewMessage(e.target.value)
  }

  const classes = useStyles();
  return (
    <>
      <Container maxWidth="md" className={classes.container}>
        <Container maxWidth="md" className={classes.heading}>
          <Typography variant="h5" className={classes.header} component="span">
            Chat
          </Typography>
          <Typography variant="h6" className={classes.userNum} component="span">
            Current Users {numUsers}
          </Typography>
          <Divider />
        </Container>
        <div className={classes.messageList}>
          <MessageList
            messages={messageList}
            loading={loading}
            user={props.user}
          />
        </div>
        <Container maxWidth="md" className={classes.inputMessage}>
          <TextField
            variant="outlined"
            value={newMessage}
            className={classes.input}
            onChange={handleMessage}
            label="Message"
            inputRef={inputMessageRef}
          />
          <Button
            onClick={sendMessage}
            className={classes.button}
            color="primary"
            variant="contained"
          >
            Send
          </Button>
        </Container>
      </Container>
    </>
  );
};

export default ChatRoom;
