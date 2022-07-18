const { DataTypes } = require('sequelize');

/** @type {import('sequelize').ModelAttributes} */
const attributtes = {
  postId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'BlogPost',
      key: 'id',
  }},
  categoryId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'Category',
      key: 'id',
  }},
};

/** @param {import('sequelize').Sequelize} sequelize */
module.exports = (sequelize) => {
  const PostCategory = sequelize.define('PostCategory', attributtes, {
    tableName: 'PostCategories',
    timestamps: false,
  });
  PostCategory.associate = (models) => {
    models.Category.belongsToMany(models.BlogPost, {
      as: `blogposts`,
      foreignKey: 'categoryId',
      otherKey: 'postId',
      through: PostCategory,
    });
    models.BlogPost.belongsToMany(models.Category, {
      as: `categories`,
      foreignKey: 'postId',
      otherKey: 'categoryId',
      through: PostCategory,
    });
  };
  return PostCategory;
};

