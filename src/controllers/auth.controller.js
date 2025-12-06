const prisma = require('../config/db');
const bcrypt = require('bcrypt');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../config/jwt');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await prisma.user.findUnique({ where: { email }});
    if (existing) return res.status(409).json({ success:false, message:'Email already taken' });

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const hashed = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: { name, email, password: hashed }
    });

    res.status(201).json({ success:true, message:'User registered', data: { id: user.id, email: user.email, name: user.name }});
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email }});
    if (!user) return res.status(401).json({ success:false, message:'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success:false, message:'Invalid credentials' });

    const payload = { userId: user.id, role: user.role };
    const access = signAccessToken(payload);
    const refresh = signRefreshToken(payload);
    res.json({ success:true, message:'Login success', data: { accessToken: access, refreshToken: refresh }});
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success:false, message:'Refresh token required' });
    const decoded = verifyRefreshToken(refreshToken);
    const payload = { userId: decoded.userId, role: decoded.role };
    const access = signAccessToken(payload);
    res.json({ success:true, message:'Token refreshed', data: { accessToken: access }});
  } catch (err) {
    return res.status(401).json({ success:false, message:'Invalid refresh token' });
  }
};

const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id: true, email: true, name: true, role: true, createdAt: true }});
    res.json({ success:true, message:'Current user', data: user });
  } catch (err) { next(err); }
};

module.exports = { register, login, refresh, me };