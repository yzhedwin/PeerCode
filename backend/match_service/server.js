const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { uuid } = require("uuidv4");
const cors = require("cors");
const app = express();
app.use(cors());
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});
var waiting_easy = null;
var waiting_medium = null;
var waiting_hard = null;

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("disconnect", (reason) => {
    console.log(reason);
  });
  socket.on("join_room", (room) => {
    socket.join(room);
  });
  socket.on("match_easy", (sid) => {
    if (waiting_easy === null) {
      waiting_easy = sid;
    } else {
      const room_id = String(uuid());
      socket.to(waiting_easy).emit("match", "easy" + room_id);
      socket.emit("match", "easy" + room_id);
      waiting_easy = null;
    }
  });
  socket.on("match_medium", (sid) => {
    if (waiting_medium === null) {
      waiting_medium = sid;
    } else {
      const room_id = String(uuid());
      socket.to(waiting_medium).emit("match", "medium" + room_id);
      socket.emit("match", "medium" + room_id);
      waiting_medium = null;
    }
  });
  socket.on("match_hard", (sid) => {
    if (waiting_hard === null) {
      waiting_hard = sid;
    } else {
      const room_id = String(uuid());
      socket.to(waiting_hard).emit("match", "hard" + room_id);
      socket.emit("match", "hard" + room_id);
      waiting_hard = null;
    }
  });
  socket.on("match_cancel_easy", (sid) => {
    console.log("cancel_easy", sid);
    waiting_easy = null;
  });
  socket.on("match_cancel_medium", (sid) => {
    console.log("cancel_medium", sid);
    waiting_medium = null;
  });
  socket.on("match_cancel_hard", (sid) => {
    console.log("cancel_hard", sid);
    waiting_hard = null;
  });
  socket.on("code-changes", (room_id, code) => {
    socket.to(room_id).emit("chatroom-code", code);
  });
});

httpServer.listen(5002);
