const express = require("express");
const fileUpload = require("express-fileupload");

const app = express();
const PORT = process.env.PORT || 8000;

const socketController = require("./controllers/socketController");

app.use(fileUpload());

app.use("/", socketController);

app.use("/", (req, res) => {
  res.status(200).json({ message: "Connected" });
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

module.exports = app;
