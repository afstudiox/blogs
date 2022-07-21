const { DataTypes } = require('sequelize');

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

module.exports = (sequelize) => {
  const PostCategory = sequelize.define('PostCategory', attributtes, {
    tableName: 'PostCategories',
    timestamps: false,
  });
  PostCategory.associate = (models) => {
    models.Category.belongsToMany(models.BlogPost, {
      as: `blogposts`,
      through: PostCategory,
      foreignKey: 'categoryId',
      otherKey: 'postId',
    });
    models.BlogPost.belongsToMany(models.Category, {
      as: `categories`,
      through: PostCategory,
      foreignKey: 'postId',
      otherKey: 'categoryId',
    });
  };
  return PostCategory;
};

