const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ShareableLink = sequelize.define('ShareableLink', {
  token: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = ShareableLink;