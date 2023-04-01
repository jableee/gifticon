const mongoose = require('mongoose')

const { Schema } = mongoose

const gifticonSchema = new Schema({
  name: String,
  bar_code: String,
  image_url: String,
  price: Number,
  provider: String
})

module.exports = mongoose.model('Gifticon', gifticonSchema)