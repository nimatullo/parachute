class IpParser {
  static parse(req) {
    let ip = "";
    if (req.headers["x-forwarded-for"]) {
      ip = req.headers["x-forwarded-for"];
    } else {
      ip = req.socket.remoteAddress;
    }

    // Check if IP is localhost
    if (ip === "::1" || ip === "::ffff:127.0.0.1") {
      ip = "127.0.0.1";
    }

    // Check if IP is private
    if (IpParser.isIpPrivate(ip)) {
      ip = "priv";
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
