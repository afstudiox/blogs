const authService = require('../services/authService');
const postService = require('../services/postService');

const postController = { 
  create: async (req, res) => {
    const data = await postService.validateBody(req.body);
    const { id } = await authService.readToken(req.headers.authorization);
    await postService.checkCategories(data);
    data.userId = id;
    const insertedData = await postService.create(data);
    return res.status(201).json(insertedData);
  },
};
  
module.exports = postController;