const { Router } = require('express');
const postController = require('../controllers/postController');
const validateToken = require('../middlewares/validateToken');

const postRoute = Router();

postRoute.get('/search', validateToken, postController.readQuery);
postRoute.post('/', validateToken, postController.create);
postRoute.get('/', validateToken, postController.read);
postRoute.get('/:id', validateToken, postController.readId);
postRoute.put('/:id', validateToken, postController.update);
postRoute.delete('/:id', validateToken, postController.delete);

module.exports = postRoute;