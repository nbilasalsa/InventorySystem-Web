// File: src/middleware/role.middleware.js (KODE PERBAIKAN ESM)

export default function authorize(requiredRoles = []) {
  return (req, res, next) => {
    // Asumsi req.user diset oleh authenticate middleware
    if (!req.user || !req.user.role) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const userRole = req.user.role.toUpperCase();

    // Jika requiredRoles kosong, otorisasi diizinkan untuk semua user terotentikasi.
    if (requiredRoles.length === 0) {
        return next();
    }
    
    // Cek apakah peran user termasuk dalam peran yang dibutuhkan
    if (requiredRoles.includes(userRole)) {
      next();
    } else {
      return res.status(403).json({ success: false, message: 'Forbidden: Insufficient privileges' });
    }
  };
};