export const isAdmin = (req, res, next) => {
  // Check if the user exists and has the admin role we added to the model
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    // 403 Forbidden is the standard security response for unauthorized access
    res.status(403).json({ message: "Access denied. Admin rights required." });
  }
};