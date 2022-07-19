const { DataTypes } = require('sequelize');

/** @type {import('sequelize').ModelAttributes} */
const attributes = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  title: {
    type: DataTypes.STRING
  },
  content: {
    type: DataTypes.STRING
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
  }},
  published: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  updated: {
    allowNull: false,
    type: DataTypes.DATE,
  }
};

/** @param {import('sequelize').Sequelize} sequelize */
module.exports = (sequelize) => {
  const BlogPost = sequelize.define(
    'BlogPost',
    attributes,
    { tableName: 'BlogPosts', timestamps: true, createdAt: `published`, updatedAt: 'updated' }
  )
  BlogPost.associate = (models) => {
    BlogPost.belongsTo(models.User, {
      foreignKey: 'id',
      as: 'user'
    });
  };
  return BlogPost;
};
