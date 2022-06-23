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
  });
});

window.addEventListener("beforeunload", () => connections.disconnect());

function getWSEndpoint() {
  return location.origin.replace(/^http/, "ws") + "/";
}
