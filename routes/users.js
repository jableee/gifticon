const express = require('express')
const { charge } = require('../controller/user/point')
const router = express.Router()
const { signup, signin } = require('../controller/user/users')
const { authJWT } = require('../middleware/authJWT')

router.post('/signup', signup)

router.get('/signin', signin)

router.post('/charge', authJWT, charge)

module.exports = router