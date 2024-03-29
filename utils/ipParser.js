class IpParser {
  static parse(req) {
    let ip = "";
    if (req.headers["cf-connecting-ip"]) {
      ip = req.headers["cf-connecting-ip"];
    } else {
      ip = req.socket.remoteAddress;
    }

    console.log(`Incoming connection from ${ip}`);

    // Check if IP is localhost

    // DEV IP
    if (ip.includes("192.168")) {
      return "127.0.0.1";
    }

    if (ip === "::1" || ip === "::ffff:127.0.0.1") {
      ip = "127.0.0.1";
    }

    return ip;
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
}

module.exports = IpParser;
