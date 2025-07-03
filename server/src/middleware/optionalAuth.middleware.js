const jwt = require("jsonwebtoken");

// Middleware ini akan mendekode token jika ada, tapi tidak akan error jika tidak ada.
const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Simpan info user jika token valid
    } catch (error) {
      // Token tidak valid, abaikan saja
      req.user = null;
    }
  }
  next();
};

module.exports = optionalAuthMiddleware;
