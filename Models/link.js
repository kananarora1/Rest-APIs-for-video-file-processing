const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Link = sequelize.define('Link', {
  videoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

module.exports = Link;
