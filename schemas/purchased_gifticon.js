const mongoose = require('mongoose')

const { Schema } = mongoose

const purchased_Gifticon = new Schema({
  gifticon: Object,
  buyer_id: Object,
  is_used: Boolean,
  receiver: Object,
  issued_date: Date,
  expiration_date: Date,
})

module.exports = mongoose.model('Purchased_Gifticon', purchased_Gifticon)