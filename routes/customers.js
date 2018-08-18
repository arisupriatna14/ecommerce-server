const express = require('express');
const router = express.Router();
const { 
  signup,
  signin,
  signinFacebook,
  listItemCustomer
} = require('../controllers/customer')

router
  .post('/', signup)
  .post('/signin/facebook', signinFacebook)
  .post('/signin', signin)
  .patch('/itemCollection', listItemCustomer)

module.exports = router;
