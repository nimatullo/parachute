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

  sendDeviceInfo() {
    const deviceInfo = this._ui.getDevice();
    this.ws.send(
      JSON.stringify({
        type: "device-info",
        from: this.id,
        deviceInfo: deviceInfo,
      })
    );
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
      case "file-transfer-success":
        if (message.from !== this.id) this._ui.fileTransferComplete();
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
    this._ui.setDevice(otherPair.device);
  }

  handleDownload(file) {
    const bytes = new Uint8Array(file.blob.data);
    const blob = new Blob([bytes], { type: file.mime });
    this._ui.displayDownloadDiv(blob, file.name);
    this.ws.send(JSON.stringify({ type: "download-complete", from: this.id }));
  }

  handleNewConnection(connectionInfo) {
    if (this.id) return;
    this.id = connectionInfo.id;
    this._ui.setName(connectionInfo.name);
    this.sendDeviceInfo();
  }

  get UI() {
    return this._ui;
  }

  upload() {
    this._ui.showProgressIndicator();

    const file = document.getElementById("file").files[0];

    if (!file) {
      this._ui.hideProgressIndicator();
      this._ui.setFileTransferStatus(
        "Please select a file before attemping to upload.",
        "error"
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    var req = new XMLHttpRequest();
    req.upload.addEventListener("progress", this.progressHandler.bind(this));

    req.open("POST", "/upload");
    req.setRequestHeader("X-Origin-Id", this.id); // Let the server know who sent this
    req.addEventListener("load", () => {
      if (req.status !== 200) {
        this._ui.setFileTransferStatus(
          "Error uploading file! Please try again",
          "error"
        );
      } else {
        this._ui.setFileTransferStatus(
          "File upload complete. Waiting for peer to finish download...",
          "info"
        );
      }
    });
    req.send(formData);
  }

  progressHandler(event) {
    this._ui.updateTransferPercent(
      `${Math.round((event.loaded / event.total) * 100)}%`
    );
  }
}

export default SocketClientManager;
