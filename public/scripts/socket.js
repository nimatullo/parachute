import UI from "./ui.js";

class SocketClientManager {
  constructor(url) {
    this.ws = new WebSocket(url);
    this._ui = new UI();
    this.id = "";
    this.isReady = false;
  }

  connect() {
    this.ws.onopen = () => this._ui.updateWebSocketStatus();
    this.ws.onmessage = this.handleIncomingMessage.bind(this);
  }

  disconnect() {
    this.ws.send(JSON.stringify({ type: "disconnected", from: this.id }));
    this.ws.close();
  }

  handleIncomingMessage(evt) {
    const message = JSON.parse(evt.data);
    switch (message.type) {
      case "file":
        if (message.from !== this.id) this.handleDownload(message.data);
        break;
      case "new-connection":
        this.handleNewConnection(message.connectionInfo);
        break;
      case "ready":
        this.handleReady(message.pairs);
        break;
      case "ping":
        this.sendPong();
        break;
      case "left-connection":
        this.handleUnready();
        break;
      default:
        console.log("Unknown message type:", message.type);
    }
  }

  handleUnready() {
    this.isReady = false;
    this._ui.unready();
  }

  sendPong() {
    this.ws.send(JSON.stringify({ type: "pong", from: this.id }));
  }

  handleReady(pairs) {
    this.isReady = true;
    const otherPair = pairs.find((pair) => pair.id !== this.id);
    this._ui.ready(otherPair.name, this.upload.bind(this));
  }

  handleDownload(file) {
    const bytes = new Uint8Array(file);
    const blob = new Blob([bytes], { type: file.mime });
    this._ui.startDownload(blob, file.name);
  }

  handleNewConnection(connectionInfo) {
    if (this.id) return;
    this.id = connectionInfo.id;
    this._ui.setName(connectionInfo.name);
  }

  get UI() {
    return this._ui;
  }

  upload() {
    const file = document.getElementById("file").files[0];

    const formData = new FormData();
    formData.append("file", file);

    fetch("/upload", {
      method: "POST",
      body: formData,
      headers: {
        "X-Origin-Id": this.id, // Let the server know who sent this
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

export default SocketClientManager;
