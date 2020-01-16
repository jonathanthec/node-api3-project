const express = require('express');
const postRouter = require('../posts/postRouter');
const userRouter = require('../users/userRouter');

const server = express();

server.use(express.json());
server.use('/api/posts', postRouter);
server.use('/api/user', userRouter);

server.get('/', (req, res) => {
    res.json({ message: 'server up and running' });
});

module.exports = server;