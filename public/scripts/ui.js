class UI {
  constructor() {
    this.status = document.getElementById("status");
    this.uploadButton = document.getElementById("upload-button");
    this.pairStatus = document.getElementById("pair-status");
    this.me = document.getElementById("me");
    this.device = document.getElementById("device");
  }

  updateWebSocketStatus() {
    this.status.innerHTML = "Connected";
  }

  setDevice(device) {
    const div = document.createElement("div");
    div.className = "device";

    const icon = document.createElement("div");
    icon.className = "icon";
    icon.innerHTML = this.getDeviceIcon(device.type);

    const name = document.createElement("div");
    name.className = "name";
    name.innerHTML = device.device;

    div.appendChild(icon);
    div.appendChild(name);

    this.device.appendChild(div);
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

  // Get device type and browser name
  getDevice() {
    const userAgent = navigator.userAgent;

    let device = "";

    // Check if iOS or Android
    if (
      userAgent.match(/iPhone/i) ||
      userAgent.match(/iPad/i) ||
      userAgent.match(/iPod/i)
    ) {
      device = "iOS";
    } else if (userAgent.match(/Android/i)) {
      device = "Android";
    } else {
      device = "Desktop";
    }

    // Get browser name
    if (userAgent.match(/Chrome/i) || userAgent.match(/Chromium/i)) {
      device += " Chrome";
    } else if (userAgent.match(/Safari/i)) {
      device += " Safari";
    } else if (userAgent.match(/Firefox/i)) {
      device += " Firefox";
    } else {
      device += " Browser";
    }

    return {
      device,
      type: userAgent.match(/Mobile/i) ? "mobile" : "desktop",
    };
  }

  getDeviceIcon(type) {
    switch (type) {
      case "mobile":
        return '<img src="https://img.icons8.com/material/96/000000/iphone-x.png"/>';
      case "desktop":
        return '<img src="https://img.icons8.com/material/96/000000/monitor--v1.png"/>';
      default:
        return '<img src="https://img.icons8.com/material/96/000000/help--v1.png"/>';
    }
  }
}

export default UI;
