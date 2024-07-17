const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  // Check if token does not exist
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, '6ca6f1537279dd0dd9f483e227fdfb3c2525c26d122ab86f357000700863548553d62edd56d27825030284ba9c8c2ef54eb454cb41fcabb505a41c5eb37975cd');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = verifyToken;

 