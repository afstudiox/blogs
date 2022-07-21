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

  readId: async (req, res) => {
    const post = await postService.readId(req.params);
    return res.status(200).json(post);
  },

  update: async (req, res) => {
    const { id } = req.params;
    // validar se os campos do Joi são válidos 
    const dataValidated = await postService.validateBodyUpdate(req.body); 
    // identifica o usuário do token 
    const user = await authService.readToken(req.headers.authorization);
    console.log('\n ID QUE VEM DO TOKEN >>>>>', user.id);
    console.log('\n ID QUE VEM DO PARAMETRO >>>>>', id);
    console.log('\n', id);
    // verificar se o post a ser alterado é da pessoa autenticada 
    await postService.checkUserOwner(id, user.id); 
    // envia dos dados para alteração do post
    const postUpdated = await postService.update(id, dataValidated);
    return res.status(200).json(postUpdated);
  },

  delete: async (req, res) => {
    const { id } = req.params;
    // identifica o usuário do token 
    const user = await authService.readToken(req.headers.authorization);
    // verificar se o post existe
    const post = await postService.readId(req.params);
    const postJson = post.toJSON();
    // verificar se o post a ser alterado é da pessoa autenticada 
    await postService.checkUserOwner(postJson.userId, user.id); 
    // deletar o post
    await postService.delete(id);
    // console.log(postDeleted);
    res.sendStatus(204);
  },

  readQuery: async (req, res) => {
    const { q } = req.query;
    const search = await postService.readQuery(q);
    res.status(200).json(search);
  },

};
  
module.exports = postController;