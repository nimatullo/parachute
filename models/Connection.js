const { v4: uuid } = require("uuid");
const generateName = require("../services/generator");

module.exports = class Connection {
  constructor(socket) {
    this.id = uuid();
    this.name = generateName();
    this.socket = socket;
  }
};
