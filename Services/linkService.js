const ShareableLink = require('../Models/link');

const generateShareableLink = async (filePath, expirationTime = 24 * 60 * 60 * 1000) => { // 24 hours
  const { default: cryptoRandomString } = await import('crypto-random-string');

  const token = cryptoRandomString({ length: 10, type: 'url-safe' });
  const expiresAt = new Date(Date.now() + expirationTime);

  const link = await ShareableLink.create({
    token,
    filePath,
    expiresAt,
  });

  return `http://localhost:3000/links/share/${token}`;
};

module.exports = { generateShareableLink };
