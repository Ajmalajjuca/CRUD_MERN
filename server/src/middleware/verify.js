import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
    try {
        console.log('Headers:', req.headers);
        console.log('Cookies:', req.cookies);

        let token;
        
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
        
        if (!token && req.cookies?.token) {
            token = req.cookies.token;
        }

        console.log('Extracted token:', token);

        if (!token) {
            return res.status(401).json({ 
                message: 'Authentication required',
                details: 'No token found in headers or cookies'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        const user = await User.findById(decoded.userId);
        console.log('Found user:', user ? 'Yes' : 'No');

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (user.status === 'blocked') {
            return res.status(401).json({ message: 'User is blocked' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(401).json({ 
            message: 'Invalid or expired token',
            error: error.message 
        });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        if (req.user.role !== 'admin' && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        next();
    } catch (error) {
        console.error('Admin Check Error:', error);
        res.status(403).json({ 
            message: 'Admin verification failed',
            error: error.message 
        });
    }
};

