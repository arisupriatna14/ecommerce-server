const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
  imgUrl: {
    type: String,
    require: true
  },
  title: {
    type: String,
    require: true
  },
  price: {
    type: Number,
    require: true
  }
})

module.exports = mongoose.model('Item', itemSchema)