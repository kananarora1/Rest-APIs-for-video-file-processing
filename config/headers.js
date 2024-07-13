require('dotenv').config();
const api_token = process.env.API_TOKEN;

const headers = {
    'Authorization': `Bearer ${api_token}`,
    'Content-Type': 'application/json'
}

module.exports = headers;