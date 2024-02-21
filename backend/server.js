const cors = require("cors");
const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const app = express();
const PORT = 2000;
const server = createServer(app);
const mockdb = {
  kajame: {
    isNotification: true,
    unread: 3,
    messages: [
      { type: "message", message: "Hello" },
      { type: "chat", message: "kajame" },
    ],
  },
  maxoty: {
    isNotification: true,
    unread: 1,
    messages: [{ type: "chat", message: "Test" }],
  },
};
const mockRedis = {};

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/:name", (req, res) => {
  const { name } = req.params;
  mockdb[name];

  // emit to user
  const socketId = mockRedis[name];
  io.emit(`${socketId}/notification`, mockdb[name]);

  return res.json({ success: true });
});

io.use(function (socket, next) {
  if (socket.handshake.query && socket.handshake.query.name) {
    socket.user = socket.handshake.query.name;
  }
  next();
});

io.on("connection", (socket) => {
  if (socket.user) {
    mockRedis[socket.user] = socket.id;
  }

  console.log(socket.id, socket.user);
  console.log("a user connected");

  socket.on("disconnect", (reason) => {
    console.log("= disconnect =");
    console.log(reason);
    console.log("===");
  });
});

server.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});
