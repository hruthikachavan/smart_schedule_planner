const jwt    = require('jsonwebtoken');
const { query } = require('../config/prisma');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await query(`SELECT id, name, email, "createdAt" FROM "User" WHERE id = $1`, [decoded.userId]);
    if (!result.rows.length) return res.status(401).json({ success: false, message: 'User not found' });
    req.user = result.rows[0];
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = protect;
