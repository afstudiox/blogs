const { Router } = require('express');
const userController = require('../controllers/userController');
const validateToken = require('../middlewares/validateToken');

const userRoute = Router();

userRoute.delete('/me', validateToken, userController.delete);
userRoute.post('/', userController.createUser);
userRoute.get('/', validateToken, userController.readUsers);
userRoute.get('/:id', validateToken, userController.get);

module.exports = userRoute;