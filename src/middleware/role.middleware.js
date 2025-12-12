export default function authorize(requiredRoles = []) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const userRole = req.user.role.toUpperCase();

    if (requiredRoles.length === 0) {
      return next();
    }

    if (requiredRoles.includes(userRole)) {
      return next();
    }

    return res.status(403).json({ success: false, message: 'Forbidden: Insufficient privileges' });
  };
}
