const { createClerkClient } = require('@clerk/clerk-sdk-node');

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const extensionUserId = req.headers['x-user-id'];
        console.log(`[AUTH] Path=${req.path} Method=${req.method} HasAuth=${!!authHeader} HasExtId=${!!extensionUserId}`);

        if (!authHeader && extensionUserId) {
            // Support for extension/standalone access via User ID
            req.auth = { userId: extensionUserId };
            return next();
        }

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];
        
        try {
            const sessionClaims = await clerk.verifyToken(token);
            
            req.auth = { userId: sessionClaims.sub };
            next();
        } catch (err) {
            console.error('Clerk verification error:', err);
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = authMiddleware;
