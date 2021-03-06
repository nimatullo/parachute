import SocketClientManager from "./SocketClientManager.js";

let connections = null;

window.addEventListener("load", () => {
  connections = new SocketClientManager(getWSEndpoint());
  connections.connect();
});

window.addEventListener("beforeunload", () => connections.disconnect());

function getWSEndpoint() {
  return location.origin.replace(/^http/, "ws") + "/";
}
