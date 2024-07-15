const Link = require('../Models/link');

const createLink = async (body) => {
  const { videoId, expiryDate } = body;

  const link = await Link.create({ videoId, expiryDate });
  return link;
};

module.exports = { createLink };
