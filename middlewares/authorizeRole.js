// middlewares/authorizeRole.js
const authorizeRole = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.role || !requiredRoles.includes(req.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }
    next();
  };
};

module.exports = authorizeRole;
