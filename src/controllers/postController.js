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

  read: async (req, res) => {
    const posts = await postService.read();
    return res.status(200).json(posts);
  },
};
  
module.exports = postController;