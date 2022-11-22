const express = require("express");
const http = require("http");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const fs = require("fs");
const WebSocket = require("ws");

const app = express();
const PORT = process.env.PORT || 8000;

const socketController = require("./controllers/socketController");

app.use(cors());
app.use(fileUpload());
app.use(express.static("public"));

app.use("/", socketController.router);

app.use("/", (_req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  fs.createReadStream("public/index.html").pipe(res);
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
wss.on("connection", (socket, req) => {
  // Get the custom room id if the request url has customRoom query param
  socketController.manager.onConnection(socket, req);
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

module.exports = app;
