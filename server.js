const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const fs = require("fs");
const WebSocket = require("ws");

const app = express();
const PORT = process.env.PORT || 8000;

const socketController = require("./controllers/socketController");
const ConnectionManager = require("./services/connectionManager");
const manager = new ConnectionManager();

const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (socket, req) => manager.onConnection(socket, req));

wss.on("close", (socket, req) => console.log("Connection closed", socket));

app.use(cors());
app.use(fileUpload());
app.use(express.static("public"));

app.use("/", socketController);

app.use("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  fs.createReadStream("public/index.html").pipe(res);
});

const server = app.listen(PORT, () =>
  console.log(`Server is listening on port ${PORT}`)
);

server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});

module.exports = app;
