const express = require("express");
const router = express.Router();
const WebSocket = require("ws");
const ConnectionManager = require("../services/connectionManager");
const manager = new ConnectionManager();

const wss = new WebSocket.Server({ port: 3030 });

wss.on("connection", (socket, request) => {
  manager.addConnection(socket, request);
});

router.post("/upload", (req, res) => {
  const originIp = manager.setIp(req);
  const originId = req.headers["x-origin-id"];

  const file = req.files.file;
  const fileName = file.name;

  const data = {
    blob: file.data,
    name: fileName,
    mime: file.mimetype,
    ext: file.mimetype.split("/")[1],
  };

  manager.send(
    {
      type: "file",
      data: data,
      from: originId,
    },
    originIp
  );

  res.status(200).json({ message: `File ${fileName} uploaded` });
});

module.exports = router;
