import SocketClientManager from "./socket.js";

var connections = null;

window.addEventListener("load", () => {
  connections = new SocketClientManager(getWSEndpoint());
  connections.connect();
});

window.addEventListener("beforeunload", () => connections.handleDisconnect());

function getWSEndpoint() {
  return location.origin.replace(/^http/, "ws") + "/";
}
