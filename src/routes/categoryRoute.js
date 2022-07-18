const { Router } = require('express');
const categoryController = require('../controllers/categoryController');
const validateToken = require('../middlewares/validateToken');

const categoryRoute = Router();

categoryRoute.post('/', validateToken, categoryController.create);

module.exports = categoryRoute;