const linkService = require('../Services/linkService');

const createLink = async (req, res) => {
  try {
    const link = await linkService.createLink(req.body);
    res.status(201).json(link);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createLink };
