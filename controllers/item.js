const Item = require('../models/item')

module.exports = {
  addItem: (req, res) => {
    const { imgUrl, title, price, category } = req.body

    Item.create({ imgUrl, title, price, category })
      .then(resultItem => {
        res.status(200).json({
          message: "Add item success",
          resultItem
        })
      })
      .catch(err => {
        res.status(500).json({
          errorAddItem: err
        })
      })
  },

  getAllItem: (req, res) => {
    Item
      .find({})
      .sort({'submittedDate': 'desc'})
      .then(dataAllItem => {
        res.status(200).json({
          message: "Get all items success",
          dataAllItem
        })
      })
      .catch(err => {
        res.status(500).json({
          errorGetAllItem: err
        })
      })
  },

  updateItem: (req, res) => {
    const { imgUrl, title, price } = req.body
    
    Item
      .updateOne(
        {
          _id: req.params.itemId
        },
        {
          $set: {
            imgUrl: imgUrl,
            title: title,
            price: price,
          }
        }
      )
      .then(resultUpdateItem => {
        res.status(200).json({
          message: "Update item success",
          resultUpdateItem
        })
      })
      .catch(err => {
        res.status(500).json({
          errorUpdateItem: err
        })
      })
    
  },

  deleteItem: (req, res) => {
    Item.deleteOne({ _id: req.params.itemId })
      .then(resultDeleteItem => {
        res.status(200).json({
          message: "Delete item success",
          resultDeleteItem
        })
      })
      .catch(err => {
        res.status(500).json({
          errorDeleteItem: err
        })
      })
  }

}