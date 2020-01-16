const express = require('express');
const router = express.Router();
const UserDB = require('./userDb');
const PostDB = require('../posts/postDb');

router.post('/', (req, res) => {
  // do your magic!
});

router.post('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
});

router.get('/', checkRole, (req, res) => {
  UserDB.get().then(users => {
    res.status(200).json(users)
  }).catch(() => {
    res.status(500).json({ errorMessage: "Cannot access this information "})
  })
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id || req.body.user_id;

  UserDB.getById(id).then(user => {
    if(user) {
      req.user = user;
      return next();
    }
    else {
      res.status(404).json({ message: "invalid user id" });
    }
  }).catch(() => {
    res.status(500).json({ message: "cannot find user from database" });
  });
}

function validateUser(req, res, next) {
  if(!req.body) {
    res.status(400).json({ message: "missing user data" });
  }
  if(!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  }
  next();
}

function validatePost(req, res, next) {
  if(!req.body) {
    res.status(400).json({ message: "missing post data" });
  }
  if(!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  }
  next();
}

function checkRole(role) {
  return function(req, res, next) {
    if(req.headers.role === role) {
      next();
    }
    else {
      res.status(403).json({ message: "illegal access" });
    }
  }
}

module.exports = router;
