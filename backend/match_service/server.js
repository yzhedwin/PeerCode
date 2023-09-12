const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
app.use(cors());
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("disconnect", (reason) => {
    console.log(reason);
  });
  socket.on("match_easy", (arg, callback) => {
    console.log(arg);
    //find match

    callback("found a match");
  });
  socket.on("match_medium", (arg, callback) => {
    console.log(arg);
    //find match
    callback("found a match");
  });
  socket.on("match_hard", (arg, callback) => {
    console.log(arg);
    //find match
    callback("found a match");
  });
});

httpServer.listen(5002);
