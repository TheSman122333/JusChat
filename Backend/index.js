const express = require("express");
const { addUser, removeUser, getUsersInRoom } = require("./user");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors()); // Resolves a bunch of issues with the connection and removes annoying bugs

const server = http.createServer(app);
const io = new Server(server, {
  // Done to resvole any cors(cross orgin resource sharing) issue that would arise
  cors: {
    origin: "http://localhost:3003", // Site where our frontend is
    methods: ["GET", "POST"], // Accept only these two methods
  },
});

// Listening for event with name connection
io.on("connection", (socket) => {
  console.log(`User connected : ${socket.id}`);

  socket.on("join_room", ({ room, username }) => {
    const user = addUser(socket.id, username, room);

    socket.emit("message", {
      user: "Chat Bot",
      text: `JusChat welcomes you ${user.name}!`,
      room: user.room,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "Chat Bot", text: `${user.name} has joined` }); 

    socket.join(user.room);
    io.to(user.room).emit("user_list", getUsersInRoom(user.room)); 
  });

  // Sending msgs only with same room
  socket.on("send_msg", (data) => {
    socket.to(data.room).emit("receive_msg", data);
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      console.log(user);
      socket.to(user.room).emit("message", {
        user: "Chat Bot",
        text: `${user.name} has left the chat`,
      }); 
      io.to(user.room).emit("user_list", getUsersInRoom(user.room)); 
    }
  });
});

// Port where the server is setup
server.listen(3001, () => {
  console.log("Juswanth is awesome");
});
