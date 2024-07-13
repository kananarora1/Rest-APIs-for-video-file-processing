require('dotenv').config();

const api_token = process.env.API_TOKEN;
function authenticate(req, res, next) {
    const token = req.headers['authorization'];
    if (token === api_token) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

module.exports = authenticate;
