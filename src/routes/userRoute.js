const { Router } = require('express');
const userController = require('../controllers/userController');
const validateToken = require('../middlewares/validateToken');

const userRoute = Router();

userRoute.post('/', userController.createUser);
userRoute.get('/', validateToken, userController.readUsers);
userRoute.get('/:id', validateToken, userController.get);

module.exports = userRoute;