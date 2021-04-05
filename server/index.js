const app = require("express")();
const jwt = require("jsonwebtoken");
const http = require("http").Server(app);
const PORT = process.env.PORT || 5000;
const io = require("socket.io")(http, {
  cors: "*",
});

let users = 0;
let messages = [];

app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

// io is server, socket is each user?
io.on("connection", (socket) => {
  users++;
  console.log("A user connected");
  let user = socket.handshake.query.user
  messages.push({
    text: `Welcome to the Chat ${user}!`,
    date: new Date().toDateString,
    sender: "ChatBot",
  })
  io.emit("new-user", { users, messages });

  // On receiving a message
  socket.on("send-message", (data) => {
    console.log(data);
    if (messages.length > 50) {
      messages.shift()
    }
    messages.push(data)
    io.emit("receiving-message", data);
  });
  socket.on("disconnect", (socket) => {
    console.log("A user disconnected");
    users--;
    messages.push({
      text: `${user} has left the chat`,
      date: new Date().toDateString,
      sender: "ChatBot",
    })
    io.emit("user-disconnected", {users, messages});
  });
});

http.listen(PORT, () => {
  console.log(`Server is now listening to PORT ${PORT}`);
});
