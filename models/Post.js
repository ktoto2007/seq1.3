const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Post = sequelize.define('Post', {
  title: { type: DataTypes.STRING, allowNull: false },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft',
  },
  publishedAt: { type: DataTypes.DATE, allowNull: false },
});

module.exports = Post;