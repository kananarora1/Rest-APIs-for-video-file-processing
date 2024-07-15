require('dotenv').config();

const api_token = process.env.API_TOKEN;
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    console.log('Token from header:', token);
    console.log('API Token:', api_token);

    if (token != api_token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

module.exports = { authenticateToken };
