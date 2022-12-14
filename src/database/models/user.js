const { DataTypes } = require('sequelize');

const attributes = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  displayName: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
};

module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    attributes,
    { tableName: 'Users' });
  User.associate = (models) => {
    User.hasMany(models.BlogPost, {
      foreignKey: 'id',
      as: 'blogpost'
    })
  }
  return User;
}