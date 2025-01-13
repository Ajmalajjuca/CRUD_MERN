import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const protect = async (req, res, next) => {
  console.log('verify innite:');
  
  const headers  = req.headers['authorization'];
  console.log('tokens:>>>',headers);
  const token = headers.split(" ")[1];
  

  if (token) {
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user  = await User.findById(decoded.userId).select("-password");
      console.log('token verifyd>>>',req.user);
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token.");
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    return next();
  } else {
    return res.status(403).json({ error: "You do not have access to this resource" });
  }
};

