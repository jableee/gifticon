const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
require('dotenv').config()

const connect = require('./schemas')
const userRouter = require('./routes/users')
const gifticonRouter = require('./routes/gifticons')

const app = express()
connect()

const { PORT, MONGO_URI } = process.env

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))

if(process.env.NODE_ENV === 'production'){
  app.use(morgan('combined'))
} else {
  app.use(morgan('dev'))
}

app.use('/users', userRouter)
app.use('/gifticons', gifticonRouter)