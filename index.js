const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

let users = {};

io.on("connection", (socket) => {
  socket.on("userLogins", (username) => {
    users[username] = socket.id;
    socket["_username"] = username;
    io.emit("takeOnlineStatus", users);

    // console.log(users);
  });

  socket.on("test", (data) => {
    // console.log(data.username);
    // let msg = data.data;
    let sendTo = data.currentChannel;
    if (sendTo !== "general") {
      // let sendTo = msg.split(" ")[1];
      io.to(users[sendTo]).emit("test", {
        username: data.username,
        data: data.data,
        channel: data.username
      });
    } else {
      socket.broadcast.emit("test", {
        username: data.username,
        data: data.data,
        channel: "general"
      });
    }
  });

  socket.on("giveOnlineStatus", (msg) => {
    // console.log(users.nickname);
    console.log(users);
    socket.emit("takeOnlineStatus", users);
  });

  socket.on("disconnect", () => {
    delete users[socket["_username"]];
    io.emit("takeOnlineStatus", users);
  });
});

const PORT = process.env.PORT || 80;

server.listen(PORT, () => console.log(`Listning to port ${PORT}`));
