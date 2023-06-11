const express = require('express');
const app = express();
const http = require("http");
const cors = require("cors")
const {Server} = require("socket.io");
app.use(cors());  // Resolves a bunch of issues with the connection and removes annoying bugs

const server = http.createServer(app);

const io = new Server(server,{
    // Done to resvole any cors(cross orgin resource sharing) issue that would arise
    cors:{
        origin: "http://localhost:3002",   // Site where our frontend is
        methods:["GET","POST"]   // Accept only these two methods
    }
})

// Listening for event with name connection
io.on("connection",(socket)=>{
   console.log(`User connected : ${socket.id}`);

socket.on("join_room", (room)=>{

    socket.join(room);
    console.log(`User with ID: ${socket.id} joined room:${room}`);

})

// Sending msgs only with same room
socket.on("send_msg",(data)=>{
      socket.to(data.room).emit("receive_msg",data)   
})



socket.on("disconnect",()=>{
    console.log("User Disconnected",socket.id);
   })
})  

// Port where the server is setup
server.listen(3001,() => {    
    console.log("Juswanth is awesome")
})  