const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 8000;

const socketController = require("./controllers/socketController");

app.use(cors());
app.use(fileUpload());
app.use(express.static("public"));

app.use("/", socketController);

app.use("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  fs.createReadStream("public/index.html").pipe(res);
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

module.exports = app;
