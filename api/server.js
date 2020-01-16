const express = require('express');
const postRouter = require('./routes/posts/postRouter');
const userRouter = require('./routes/users/userRouter');

const server = express();

// Creating a custom middleware
function logger(req, res, next) {
    console.log(`${req.method} to ${req.url} at ${new Date().toISOString()}`);
    next();
}

server.use(express.json());
server.use(logger);

server.use('/api/posts', postRouter);
server.use('/api/users', userRouter);

server.get('/', (req, res) => {
    res.json({ message: 'server up and running' });
});

module.exports = server;