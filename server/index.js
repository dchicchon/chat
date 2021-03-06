const app = require("express")();
const { Pool } = require("pg");
const http = require("http").Server(app);
const PORT = process.env.PORT || 5000;
const io = require("socket.io")(http, {
  cors: "*",
});

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || "postgres://me:password@localhost:5432/api",
});

// pool.connect()
let users = 0;
app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

// io is server, socket is each user?
const getMessages = async () => {
  console.log("Getting messages");
  const { rows } = await pool.query("SELECT * FROM messages");
  return rows;
};

io.on("connection", (socket) => {
  users++;
  console.log("A user connected");
  let user = socket.handshake.query.user;
  let newDate = new Date().toDateString();
  // console.log(pool);
  pool.query(
    "CREATE TABLE IF NOT EXISTS messages (id serial PRIMARY KEY, text VARCHAR(255) NOT NULL, sender VARCHAR(255) NOT NULL, date VARCHAR(255) NOT NULL );"
  );
  pool.query(
    "INSERT INTO messages (text, sender, date) VALUES ($1, $2, $3)",
    ["Welcome to the server " + user, "ChatBot", newDate],
    (error, res) => {
      if (error) {
        throw error;
      }
      getMessages().then((messages) => {
        io.emit("new-user", { users, messages });
      });
    }
  );

  // On receiving a message
  socket.on("send-message", (data) => {
    console.log(data);
    pool.query(
      "INSERT INTO messages (text, sender, date) VALUES ($1, $2, $3)",
      [data.text, data.sender, data.date],
      (error, res) => {
        getMessages().then((messages) => {
          io.emit("receiving-message", messages);
        });
      }
    );
  });
  socket.on("disconnect", (socket) => {
    console.log("A user disconnected");
    users--;
    pool.query(
      "INSERT INTO messages (text, sender, date) VALUES ($1, $2, $3)",
      [user + " has left the chat", "ChatBot", new Date().toDateString()],
      (error, res) => {
        getMessages().then((messages) => {
          io.emit("user-disconnected", { users, messages });
        });
      }
    );
  });
});

http.listen(PORT, () => {
  console.log(`Server is now listening to PORT ${PORT}`);
});
