const express = require('express');
const router = express.Router();
const { signin } = require('../controllers/customer')
const { auth } = require('../helpers/auth')

router
  .post('/signin', auth ,signin)

module.exports = router;
