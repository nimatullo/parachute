class UI {
  constructor() {
    this.status = document.getElementById("status");
    this.uploadButton = document.getElementById("upload-button");
    this.pairStatus = document.getElementById("pair-status");
    this.me = document.getElementById("me");
    this.pairDevice = document.getElementById("device");
    this.pairName = document.getElementById("pair-name");
    this.fileTransferStatus = document.getElementById("file-transfer-status");
    this.loading = document.getElementsByClassName("loading")[0];
    this.uploadContainer =
      document.getElementsByClassName("upload-container")[0];
    this.fileSelector = new FileSelector();
    this.transferPercentText = document.getElementById("transfer-percent");
  }

  updateWebSocketStatus() {
    this.status.innerHTML = "Connected";
  }

  setDevice(device) {
    const pairDiv = document.getElementsByClassName("pair")[0];

    const icon = document.createElement("div");
    icon.className = "icon";
    icon.innerHTML = this.getDeviceIcon(device.type);

    const name = document.createElement("div");
    name.className = "name";
    name.innerHTML = device.device;

    pairDiv.appendChild(icon);
    pairDiv.appendChild(name);
  }

  displayDownloadDiv(file, filename) {
    this.displayFileIcon(filename);

    const uploadArea = document.getElementsByClassName("upload-area")[0];
    uploadArea.style.display = "none";
    this.uploadButton.style.display = "none";

    const downloadArea = document.getElementsByClassName("download-area")[0];
    downloadArea.style.display = "grid";

    const fileNameHTML = document.querySelector("span#filename");

    fileNameHTML.innerHTML = filename;

    const downloadButton = document.getElementById("download-button");
    downloadButton.addEventListener("click", () =>
      this.startDownload(file, filename)
    );
    downloadButton.style.display = "inline-block";
  }

  startDownload(file, filename) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();

    this.showUploadArea();
  }

  displayFileIcon(filename) {
    let fileExtension = filename.split(".").pop();

    // Ew, fuck it. brute force if statement
    if (
      fileExtension === "jpg" ||
      fileExtension === "jpeg" ||
      fileExtension === "png" ||
      fileExtension === "gif" ||
      fileExtension === "bmp" ||
      fileExtension === "svg"
    ) {
      fileExtension = "image";
    } else if (fileExtension === "pdf") {
      fileExtension = "pdf";
    } else {
      fileExtension = "file";
    }

    const icon = document.getElementById("file-icon");

    icon.src = `https://img.icons8.com/material/96/bfc1c2/${fileExtension}.png`;
  }

  showUploadArea() {
    const uploadArea = document.getElementsByClassName("upload-area")[0];
    uploadArea.style.display = "grid";

    const downloadArea = document.getElementsByClassName("download-area")[0];
    downloadArea.style.display = "none";

    this.uploadButton.style.display = "inline-block";

    const downloadButton = document.getElementById("download-button");
    downloadButton.style.display = "none";
  }

  fileTransferComplete() {
    this.setFileTransferStatus("File transfer complete!", "success");
    this.hideProgressIndicator();
  }

  setFileTransferStatus(status, type) {
    this.hideProgressIndicator();
    this.transferPercentText.innerHTML = "";
    this.fileTransferStatus.innerHTML = status;
    this.fileTransferStatus.className = type;
  }

  ready(pairName, upload) {
    this.uploadButton.disabled = false;
    this.pairStatus.innerHTML = "";
    this.pairName.innerHTML = `Paired with <strong>${pairName}</strong>`;
    this.uploadButton.addEventListener("click", upload);
    this.uploadButton.innerHTML = "Upload";
  }

  unready() {
    this.showDisabledState();
    this.clearConnectedPair();
  }

  showDisabledState() {
    this.uploadButton.disabled = true;
    this.pairStatus.innerHTML = "🔴 Waiting for pair connection...";
  }

  clearConnectedPair() {
    const pairDiv = document.getElementsByClassName("pair")[0];
    pairDiv.innerHTML = "";

    const p = document.createElement("p");
    p.id = "pair-name";

    pairDiv.appendChild(p);

    this.pairName = p;
  }

  setName(name) {
    this.name = name;
    this.me.innerHTML = `You are ${name}`;
    document.title += ` | ${name}`;
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
        return '<img src="https://img.icons8.com/material/96/276efa/iphone-x.png"/>';
      case "desktop":
        return '<img src="https://img.icons8.com/material/96/276efa/monitor--v1.png"/>';
      default:
        return '<img src="https://img.icons8.com/material/96/276efa/help--v1.png"/>';
    }
  }

  showProgressIndicator() {
    this.loading.style.display = "inline-block";
    this.uploadContainer.style.visibility = "hidden";
  }

  hideProgressIndicator() {
    this.loading.style.display = "none";
    this.uploadContainer.style.visibility = "visible";
  }

  updateTransferPercent(percent) {
    this.transferPercentText.innerHTML = percent;
  }
}

class FileSelector {
  constructor() {
    this.uploadArea = document.getElementsByClassName("upload-area")[0];
    this.setupFileSelectorLabels();
  }

  setupFileSelectorLabels() {
    const fileSelector = document.getElementById("file");

    const label = fileSelector.nextElementSibling,
      labelVal = label.innerHTML;

    fileSelector.addEventListener("change", (e) => {
      let filename = "";

      if (fileSelector.files.length > 0) {
        filename = fileSelector.files[0].name;
      }

      if (filename) label.innerHTML = filename;
      else label.innerHTML = labelVal;

      this.showPreview(fileSelector.files[0]);
    });

    this.initializeFileUploadListeners();
  }

  showPreview(file) {
    // Only preview if file is an image
    const img = document.getElementById("preview");
    img.src = "";
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  initializeFileUploadListeners() {
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      this.uploadArea.addEventListener(eventName, this.preventDefaults, false);
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      this.uploadArea.addEventListener(eventName, this.highlight, false);
    });

    ["dragleave", "drop"].forEach((eventName) => {
      this.uploadArea.addEventListener(eventName, this.unhighlight, false);
    });

    this.uploadArea.addEventListener("drop", this.dropHandler, false);
  }

  highlight() {
    this.uploadArea.classList.add("highlight");
  }

  unhighlight() {
    this.uploadArea.classList.remove("highlight");
  }

  preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  dropHandler(e) {
    const fileInput = document.getElementById("file");

    let dt = e.dataTransfer;
    let files = dt.files;

    if (files.length > 0) {
      fileInput.files = files;
      fileInput.dispatchEvent(new Event("change"));
    }
  }
}

export default UI;
