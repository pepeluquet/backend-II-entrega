const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;
const SECRET_KEY = process.env.SECRET_KEY || 'SECRET_KEY';

function createHash(password) {
  if (!password) return null;
  return bcrypt.hashSync(password, SALT_ROUNDS);
}

function isValidPassword(password, hashedPassword) {
  if (!password || !hashedPassword) return false;
  return bcrypt.compareSync(password, hashedPassword);
}

function cookieExtractor(req) {
  if (!req) return null;

  if (req.cookies && req.cookies.currentUser) {
    return req.cookies.currentUser;
  }

  const cookieHeader = req.headers && (req.headers.cookie || req.headers.Cookie);
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map(c => c.trim());
  for (const c of cookies) {
    if (c.startsWith('currentUser=')) {
      return decodeURIComponent(c.split('=')[1]);
    }
  }

  return null;
}

function generateToken(user) {
  if (!user) return null;
  const payload = {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    cart: user.cart
  };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
}

module.exports = {
  createHash,
  isValidPassword,
  cookieExtractor,
  generateToken
};
