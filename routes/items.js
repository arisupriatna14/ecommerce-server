const express = require('express');
const router = express.Router();
const {
  getAllItem,
  addItem,
  updateItem,
  deleteItem
} = require('../controllers/item')

router 
  .get('/', getAllItem)
  .post('/addItems', addItem)
  .put('/updateItem/:itemId', updateItem)
  .delete('/deleteItem/:itemId', deleteItem)

module.exports = router;