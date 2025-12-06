const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Fail early if SECRET_KEY is not set or empty to avoid insecure verification
        const secret = process.env.SECRET_KEY;
        if (!secret) {
            console.error('FATAL: process.env.SECRET_KEY is not set or empty. Aborting authentication.');
            return res.status(500).json({ error: 'Server misconfiguration: SECRET_KEY not configured' });
        }

        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: "Authentication required" });
        }

        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;