const { registerUser, loginUser } = require('../services/auth.service');
const generateToken = require('../utils/generateToken');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user  = await registerUser(name, email, password);
    const token = generateToken(user.id);
    res.status(201).json({ success: true, data: { user, token } });
  } catch (error) { next(error); }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user  = await loginUser(email, password);
    const token = generateToken(user.id);
    res.status(200).json({ success: true, data: { user, token } });
  } catch (error) { next(error); }
};

const me = async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};

module.exports = { register, login, me };
