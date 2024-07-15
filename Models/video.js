const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Video = sequelize.define('Videos', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Video;
