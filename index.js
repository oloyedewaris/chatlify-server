const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const router = require("./router");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", socket => {
  socket.on("joinRoom", ({ username, room }, callback) => {
    const { err, user } = addUser({ id: socket.id, username, room });

    if (err) return callback(err);

    socket.emit("message", {
      user: "admin",
      text: `${user.username}, welcome to room ${user.room}, I am waris, a Full stack developer, i developed this web chat application using some latest technologies. You can view my portfolio at https://waris-portfolio.herokuapp.com. Tell friends to join this room in order to chat together. Enjoy!!!`,
      time: Number(Date.now())
    });

    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.username} has joined this room`,
      time: Number(Date.now())
    });

    socket.join(user.room);

    io.to(user.room).emit("roomInfo", {
      user: "admin",
      room: user.room,
      users: getUsersInRoom(user.room),
      time: Number(Date.now())
    });
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    callback();
    io.to(user.room).emit("message", {
      user: user.username,
      text: message,
      time: Number(Date.now())
    });
    io.to(user.room).emit("roomInfo", {
      user: "admin",
      users: getUsersInRoom(user.room),
      room: user.room,
      time: Number(Date.now())
    });
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.username} just left.`,
        time: Number(Date.now())
      });
    }
  });
});

app.use("/api", router);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on ${PORT}`));
