class UI {
  constructor() {
    this.status = document.getElementById("status");
    this.uploadButton = document.getElementById("upload-button");
    this.pairStatus = document.getElementById("pair-status");
    this.me = document.getElementById("me");
  }

  updateWebSocketStatus() {
    this.status.innerHTML = "Connected";
  }

  startDownload(file, filename) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
  }

  ready(pairName, upload) {
    this.uploadButton.disabled = false;
    this.pairStatus.innerHTML = `✅ Ready. Paired with <strong>${pairName}</strong>`;
    this.uploadButton.addEventListener("click", upload);
  }

  unready() {
    this.uploadButton.disabled = true;
    this.pairStatus.innerHTML = "🔴 Waiting for pair connection...";
  }

  setName(name) {
    this.name = name;
    this.me.innerHTML = `You are ${name}`;
  }
}

export default UI;
