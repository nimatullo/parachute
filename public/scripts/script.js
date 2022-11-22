import SocketClientManager from "./SocketClientManager.js";

let connections = null;

window.addEventListener("load", () => {
  connections = new SocketClientManager(getWSEndpoint());
  connections.connect();

  const changeRoomButton = document.getElementById("change-room-btn");
  changeRoomButton.addEventListener("click", () => {
    const roomId = document.getElementById("room-textfield").value;
    const roomIdHeader = document.getElementById("room-id-header");
    roomIdHeader.innerHTML = `Room ID: ${roomId}`;
    connections.handleRoomChange(getWSEndpoint() + `?customRoom=${roomId}`);
  });
});

window.addEventListener("beforeunload", () => connections.disconnect());

function getWSEndpoint() {
  return location.origin.replace(/^http/, "ws");
}
