const jwt = require("jsonwebtoken");

const authMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Akses ditolak, token tidak ada atau format salah." });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Menyimpan info user (userId, role) di object request

      if (allowedRoles && !allowedRoles.includes(decoded.role)) {
        return res
          .status(403)
          .json({ message: "Akses ditolak, peran tidak diizinkan." });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Token tidak valid." });
    }
  };
};

module.exports = authMiddleware;
