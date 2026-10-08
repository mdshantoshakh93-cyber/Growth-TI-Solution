const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return sendError(res, 'Name, email, and password are required', 400);
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return sendError(res, 'User with this email already exists', 400);
    }
    const user = await User.create({ name, email, password, role });
    return sendSuccess(res, { id: user._id, name: user.name, email: user.email, role: user.role }, 'User registered successfully', 201);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return sendError(res, 'Invalid credentials', 401);
    }
    return sendSuccess(res, { token: 'demo_jwt_token_' + user._id, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'Login successful');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

const getMe = async (req, res) => {
  return sendSuccess(res, { id: 'demo-user-id', name: 'Growth Architect', role: 'admin' }, 'User profile retrieved');
};

module.exports = { register, login, getMe };
