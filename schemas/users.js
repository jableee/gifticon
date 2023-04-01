const mongoose = require('mongoose')

const { Schema } = mongoose

const userSchema = new Schema({
  email: String,
  password: String,
  name: String,
  phone: String,
  point: {
    cash: { type: Number, default: 0 },
    updatedAt: Date
  }
})

module.exports = mongoose.model('User', userSchema)