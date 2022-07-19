const { Router } = require('express');
const postController = require('../controllers/postController');
const validateToken = require('../middlewares/validateToken');

const postRoute = Router();

postRoute.post('/', validateToken, postController.create);

module.exports = postRoute;