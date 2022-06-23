import SocketClientManager from "./socket.js";

var connections = null;

window.addEventListener("load", () => {
  connections = new SocketClientManager(getWSEndpoint());
  connections.connect();

  const fileSelector = document.getElementById("file");
  var label = fileSelector.nextElementSibling,
    labelVal = label.innerHTML;
  fileSelector.addEventListener("change", (e) => {
    var fileName = "";
    if (fileSelector.files.length > 0) {
      fileName = fileSelector.files[0].name;
    }

    if (fileName) {
      label.innerHTML = fileName;
    } else {
      label.innerHTML = labelVal;
    }

    showPreview(fileSelector.files[0]);
  });

  initListeners();
});

function showPreview(file) {
  // Only preview if file is an image
  var img = document.getElementById("preview");
  img.src = "";
  if (!file.type.startsWith("image/")) return;
  var reader = new FileReader();
  reader.onload = function (e) {
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

let uploadArea = document.getElementsByClassName("upload-area")[0];
function initListeners() {
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    uploadArea.addEventListener(eventName, preventDefaults, false);
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    uploadArea.addEventListener(eventName, highlight, false);
  });

  ["dragleave", "drop"].forEach((eventName) => {
    uploadArea.addEventListener(eventName, unhighlight, false);
  });

  uploadArea.addEventListener("drop", dropHandler, false);
}

function highlight(e) {
  uploadArea.classList.add("highlight");
}

function unhighlight(e) {
  uploadArea.classList.remove("highlight");
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function dropHandler(e) {
  const fileInput = document.getElementById("file");

  let dt = e.dataTransfer;
  let files = dt.files;

  if (files.length > 0) {
    fileInput.files = files;
    fileInput.dispatchEvent(new Event("change"));
  }
}

window.addEventListener("beforeunload", () => connections.disconnect());

function getWSEndpoint() {
  return location.origin.replace(/^http/, "ws") + "/";
}
