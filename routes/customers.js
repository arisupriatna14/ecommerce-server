const express = require('express');
const router = express.Router();
const { 
  signup,
  signin,
  signinFacebook
} = require('../controllers/customer')

router
  .post('/', signup)
  .post('/signin/facebook', signinFacebook)
  .post('/signin', signin)

module.exports = router;
