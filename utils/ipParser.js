class IpParser {
  static parse(req) {
    const customRoom = req.url.split("customRoom=")[1];
    if (customRoom) {
      return customRoom;
    }

    let ip = "";

    if (req.headers["cf-connecting-ip"]) {
      ip = req.headers["cf-connecting-ip"];
    } else {
      ip = req.socket.remoteAddress;
    }
    // Check if IP is localhost
    if (ip === "::1" || ip === "::ffff:127.0.0.1") {
      return "127.0.0.1";
    }

    ip = this.convertToIPv4IfIPv6(ip);

    console.log(`Incoming connection from ${ip}`);

    const subnet = ip.split(".");
    subnet.pop();
    console.log(`First order bits ${subnet.join(".")}`);

    return subnet.join(".");
  }

  static isIpPrivate(ip) {
    // Check if ip is in IPv6 format
    if (ip.indexOf(":") !== -1) {
      // Convert ip to IPv4 format
      ip = ip.split(":").pop();
    }
    return (
      ip.startsWith("192.168.") ||
      ip.startsWith("10.") ||
      ip.startsWith("172.") ||
      ip.startsWith("169.")
    );
  }

  static convertToIPv4IfIPv6(ip) {
    if (ip.indexOf(":") !== -1) {
      // Convert ip to IPv4 format
      ip = ip.split(":").pop();
    }
    return ip;
  }
}

module.exports = IpParser;
