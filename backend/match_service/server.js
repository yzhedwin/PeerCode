const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { uuid } = require("uuidv4");
const cors = require("cors");
const app = express();
app.use(cors());
const httpServer = createServer(app);
const PORT = process.env.MATCH_SERVICE_PORT;
const REACT_APP_URL = process.env.REACT_APP_URL;
const RabbitMQService = require("./message-queue/rabbitmq");
const MongoClient = require("./mongodb/mongodb");

const io = new Server(httpServer, {
    cors: {
        origin: REACT_APP_URL,
    },
});

io.on("connection", (socket) => {
    RabbitMQService.initialize().then(() => {
        //Tell web app that system is ready for matchmaking
        socket.emit("initMatchQueue", "initialized");
        // Handle user disconnect
        socket.on("disconnect", () => {
            console.log(`User disconnected with socket ID: ${socket.id}`);
            // Implement any necessary cleanup or disconnection logic
        });
        socket.on("disconnecting", async () => {
            console.log("disconnecting...", RabbitMQService.getConsumerID());
            let room_ids = Array.from(socket.rooms);
            room_ids.forEach((room_id) => {
                if (room_id !== socket.id) {
                    socket.to(room_id).emit("connection-lost", "User has left");
                    socket.leave(room_id);
                }
            });
            await RabbitMQService.getChannel()?.cancel(
                RabbitMQService.getConsumerID()
            );
        });
        // Handle matchmaking requests
        socket.on("match", (sid, difficulty) => {
            RabbitMQService.publishMessage(
                difficulty.toLowerCase(),
                JSON.stringify(sid)
            );
        });
        socket.on("match_cancel", () => {
            console.log("match_cancel", socket.id);
            RabbitMQService.publishMessage("cancelMatchmaking", socket.id);
        });

        socket.on("join_room", (room) => {
            socket.join(room);
        });
        socket.on("match-quit", (room_id) => {
            socket.to(room_id).emit("match-quit");
        });

        socket.on("match-quit-confirm", (room_id) => {
            socket.to(room_id).emit("match-quit-confirm");
            socket.leave(room_id);
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
        socket.on("callUser", (data) => {
            console.log(`Incoming call from ${data.from}`);
            socket.to(data.room).emit("callUser", {
                signal: data.signalData,
                from: data.from,
                name: data.name,
            });
        });

        socket.on("answerCall", (data) => {
            console.log(`Answering call from ${data.from}`);
            socket.to(data.room).emit("callAccepted", data.signal);
        });

        // Get matched users here
        RabbitMQService.consumeMessage(
            "matched",
            async (message, consumer_id) => {
                if (message) {
                    const data = JSON.parse(message);
                    const database = MongoClient.db(
                        process.env.MONGO_PEERCODE_DATABASE_NAME
                    );
                    const questions = database.collection("questions");

                    const query = {
                        difficulty:
                            data["difficulty"].charAt(0).toUpperCase() +
                            data["difficulty"].substring(1),
                    };
                    const questionList = await questions.find(query).toArray();
                    const questionNumber = Math.floor(
                        Math.random() * questionList.length
                    );
                    const room_id =
                        data["difficulty"] +
                        "-" +
                        data["players"][0] +
                        "-" +
                        data["players"][1];
                    //Emit room_id to both users so users can join room
                    socket
                        .to(data["players"][0])
                        .emit(
                            "match-success",
                            room_id,
                            questionList[questionNumber]["titleSlug"]
                        );
                    socket
                        .to(data["players"][1])
                        .emit(
                            "match-success",
                            room_id,
                            questionList[questionNumber]["titleSlug"]
                        );
                    RabbitMQService.setConsumerID(consumer_id);
                    RabbitMQService.getChannel()
                        ?.checkQueue(RabbitMQService.getQueue("matched"))
                        .then((status) => {
                            console.log(data, status);
                        });
                }
            }
        );
    });
});

httpServer.listen(PORT);
