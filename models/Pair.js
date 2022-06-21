const Connection = require("./Connection");

module.exports = class Pair {
  constructor(socket) {
    this._connections = [new Connection(socket)];
  }

  addConnection(socket) {
    if (this._connections.length === 2) {
      throw new Error("Pair is already full");
    }
    this._connections.push(new Connection(socket));
  }

  isReady() {
    return (
      this._connections.length === 2 &&
      this._connections.every((connection) => connection.isReady())
    );
  }

  removeConnection(id) {
    this._connections = this._connections.filter((connection) => {
      return connection.id !== id;
    });
    return this.lastConnection;
  }

  isEmpty() {
    return this._connections.length === 0;
  }

  get connections() {
    return this._connections;
  }

  get lastConnection() {
    return this._connections[this.connections.length - 1];
  }

  getPeer(id) {
    return this._connections.find((connection) => connection.id !== id);
  }

  getById(id) {
    return this._connections.find((connection) => connection.id === id);
  }

  toJSON() {
    return this._connections.map((connection) => connection.toJSON());
  }
};
