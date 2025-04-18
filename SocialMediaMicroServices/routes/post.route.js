const express = require('express');
const { popular, post1, top5 } = require('../controller/post.controller');

const router = express.Router();

router.post('/posts', popular);
router.get('/api/users/:userid/posts', post1);
router.get('/top5', top5);


module.exports = router;