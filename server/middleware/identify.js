
const jwt = require('jsonwebtoken');

const IdentifyManager = (allowedTypes) => {
    return (req, res, next) => {
        // Extract token from the request header
        const token = req.header('Authorization') || null;
        console.log('allowedTypes', allowedTypes)
        // Check if token is provided
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Token not provided' });
        }

        try {
            // Verify the token
            const decoded = jwt.verify(token, 'your-secret-key');

            // Check if the decoded token contains a valid type
            const userType = decoded.type;

            switch (userType) {
                case 'User':
                    // Additional logic for User identification
                    console.log('Identifying user...');
                    break;

                case 'Vendor':
                    // Additional logic for Vendor identification
                    console.log('Identifying vendor...');
                    break;

                case 'Public':
                    // Additional logic for Public access
                    console.log('Public access...');
                    break;

                default:
                    // Handle other types or throw an error for an invalid type
                    console.log('Invalid type specified.');
                    return res.status(403).json({ message: 'Forbidden - Invalid user type' });
            }

            // Attach user information to the request object for further use
            req.user = decoded;

            // Continue to the next middleware or route handler
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }
    };
};

const getToken = function (req) {
    if (
        req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
        // Handle token presented as a Bearer token in the Authorization header
        return req.headers.authorization.split(" ")[1];
    }
    // If we return null, we couldn't find a token.
    // In this case, the JWT middleware will return a 401 (unauthorized)
    // to the client for this request
    return null;
};

module.exports = IdentifyManager


