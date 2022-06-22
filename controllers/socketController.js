const express = require("express");
const router = express.Router();
const ConnectionManager = require("../services/connectionManager");
const manager = new ConnectionManager();
const IpParser = require("../utils/ipParser");

router.post("/upload", (req, res) => {
  const originIp = IpParser.parse(req);
  const originId = req.headers["x-origin-id"];

  const file = req.files.file;
  const fileName = file.name;

  const data = {
    blob: file.data,
    name: fileName,
    mime: file.mimetype,
    ext: file.mimetype.split("/")[1],
  };

  manager.sendFile(
    {
      type: "file",
      data: data,
      from: originId,
    },
    originIp,
    originId
  );

  res.status(200).json({ message: `File ${fileName} uploaded` });
});

module.exports = {
  router: router,
  manager: manager,
};
