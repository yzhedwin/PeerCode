const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { uuid } = require("uuidv4");
const cors = require("cors");
const app = express();
app.use(cors());
const httpServer = createServer(app);
const PORT = process.env.MATCH_SERVICE_PORT;
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

class Queue {
  constructor(difficulty) {
    this.difficulty = difficulty;
    this.user_list = [];
  }
  getUserSize() {
    return this.user_list.length;
  }
  addUser(sid) {
    this.user_list.push(sid);
  }
  getUser() {
    return this.user_list.pop();
  }
  removeUser(sid) {
    const idx = this.user_list.findIndex((usr) => usr === sid);
    this.user_list.splice(idx, 1);
  }
}

const queueDict = {
  easy: new Queue("easy"),
  medium: new Queue("medium"),
  hard: new Queue("hard"),
};

io.on("connection", (socket) => {
  socket.on("disconnect", (reason) => {
    console.log(reason);
  });
  socket.on("join_room", (room) => {
    socket.join(room);
  });
  socket.on("match", (sid, difficulty) => {
    if (queueDict[difficulty].getUserSize() < 1) {
      queueDict[difficulty].addUser(sid);
    } else {
      const room_id = String(uuid());
      other_user = queueDict[difficulty].getUser();
      socket.to(other_user).emit("match-success", difficulty + room_id);
      socket.emit("match-success", difficulty + room_id);
    }
  });

  socket.on("match_cancel", (sid, difficulty) => {
    console.log("cancel", sid, difficulty);
    queueDict[difficulty].removeUser(sid);
  });

  socket.on("code-changes", (room_id, code) => {
    socket.to(room_id).emit("chatroom-code", code);
  });
  socket.on("room-message", (room_id, msg) => {
    socket.to(room_id).emit("chatroom-chat", msg);
  });
  socket.on("code-submission", (room_id, submission) => {
    socket.to(room_id).emit("chatroom-console-result", submission);
  });
  socket.on("code-language", (room_id, language) => {
    socket.to(room_id).emit("chatroom-code-language", language);
  });
});

httpServer.listen(PORT);
