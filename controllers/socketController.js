const express = require("express");
const router = express.Router();
const WebSocket = require("ws");
const ConnectionManager = require("../models/connectionManager");
const manager = new ConnectionManager();

const wss = new WebSocket.Server({ port: 3030 });

wss.on("connection", (socket, request) => {
  manager.addConnection(socket, request);
});

router.post("/upload", (req, res) => {
  // Get file from request
  const file = req.files.file;

  // Get file name
  const fileName = file.name;
  const data = {
    blob: file.data,
    name: fileName,
    mime: file.mimetype,
    ext: file.mimetype.split("/")[1],
  };

  manager.send(data);

  res.status(200).json({ message: `File ${fileName} uploaded` });
});

module.exports = router;
