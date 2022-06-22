const express = require("express");
const ConnectionManager = require("../services/connectionManager");
const router = express.Router();

router.post("/upload", (req, res) => {
  const originIp = manager.getIp(req);
  const originId = req.headers["x-origin-id"];

  const file = req.files.file;
  const fileName = file.name;

  const data = {
    blob: file.data,
    name: fileName,
    mime: file.mimetype,
    ext: file.mimetype.split("/")[1],
  };

  ConnectionManager.sendFile(
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

module.exports = router;
