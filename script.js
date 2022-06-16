window.addEventListener("load", () => {
  connectToWebSocket();
  const connectButton = document.getElementById("connect");
  connectButton.addEventListener("click", () => {
    // Change background to red
    connectToWebSocket();
  });
});

function connectToWebSocket() {
  var ws = new WebSocket("ws://192.168.1.250:3030/");

  ws.onopen = function () {
    const status = document.getElementById("status");
    status.innerHTML = "Connected";
  };

  ws.onmessage = function (evt) {
    const file = JSON.parse(evt.data);
    downloadFile(file);
  };
}

function downloadFile(file) {
  const bytes = new Uint8Array(file.blob.data);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([bytes], { type: file.mime }));
  a.download = `${file.name}.${file.ext}`;
  a.click();
}
