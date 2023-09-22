const jwt = require('jsonwebtoken');
const { jwtSecrect } = require('../utils/helper');

exports.tokenValidator = async (req, res, next) => {
  try {
    const cookie = req?.headers?.cookie;
    
    if (!cookie) {
      return res.status(401).json({ msg: 'Token not found 1' });
    }

    const token = cookie?.split('=')[1];

    if (!token) {
      return res.status(401).json({ msg: 'Unauthorized access' });
    }

    jwt.verify(token, jwtSecrect, (err, decoded) => {
      if (err) {
        throw err;
      }

      req.id = decoded.id;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ msg: 'Unauthorized access' });
  }
};
