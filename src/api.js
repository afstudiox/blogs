const express = require('express');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const categoryRoute = require('./routes/categoryRoute');
const postRoute = require('./routes/postRoute');
const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware');
// ...

const app = express();

app.use(express.json());

// minhas rotas
app.use('/categories', categoryRoute);
app.use('/login', authRoute);
app.use('/post', postRoute);
app.use('/user', userRoute);

// Middleware de Erros
app.use(errorHandlerMiddleware);

// É importante exportar a constante `app`,
// para que possa ser utilizada pelo arquivo `src/server.js`
module.exports = app;
