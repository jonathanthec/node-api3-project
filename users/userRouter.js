const express = require('express');
const router = express.Router();
const UserDB = require('./userDb');
const PostDB = require('../posts/postDb');

router.post('/', validateUser, (req, res) => {
  const newUser = req.body;
  UserDB.insert(newUser).then(user => {
    res.status(201).json(user)
  }).catch(() => {
    res.status(500).json({ errorMessage: "an error occurred while creating user "})
  })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const newPost = req.body;
  PostDB.insert(newPost).then(post => {
    res.status(201).json(post)
  }).catch(() => {
    res.status(500).json({ errorMessage: "an error occured while creating a post" })
  })
});

router.get('/', checkAdmin, (req, res) => {
  UserDB.get().then(users => {
    res.status(200).json(users)
  }).catch(() => {
    res.status(500).json({ errorMessage: "an error occurred while accessing this information" })
  })
});

router.get('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
  UserDB.getById(id).then(user => {
    res.status(200).json(user)
  }).catch(() => {
    res.status(500).json({ errorMessage: "an error occurred while accessing this information" })
  })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const id = req.params.id;
  UserDB.getUserPosts(id).then(posts => {
    res.status(200).json(posts)
  }).catch(() => {
    res.status(500).json({ errorMessage: "an error occurred while accessing this information" })
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  const user = req.user;
  UserDB.remove(user.id).then(indicator => {
    if(indicator>0) {
      res.status(200).json({ message: "account successfully deleted", user })
    }
  }).catch(() => {
    res.status(500).json({ errorMessage: "an error occurred while deleting user" })
  })
});

router.put('/:id', validateUserId, (req, res) => {
  const user = req.user;
  const newUser = req.body;
  UserDB.update(user.id, newUser).then(indicator => {
    if(indicator>0) {
      UserDB.getById(user.id).then(changedUser => {
        res.status(200).json({ message: "user info changed", changedUser })
      }).catch(() => {
        res.status(500).json({ errorMessage: "an error has occurred" })
      })
    }
    else {
      res.status(500).json({ errorMessage: "an error has occurred" })
    }
  }).catch(() => {
    res.status(500).json({ errorMessage: "cannot change user" })
  })
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
  req.body.user_id = req.user.id;
  next();
}

function checkAdmin(req, res, next) {
  if(req.headers.role === "admin") {
    return next();
  }
  else {
    res.status(403).json({ message: "illegal access" });
  }
}

module.exports = router;
