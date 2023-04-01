const express = require('express')
const { addGifticon, getGifticonList, buyGifticon, sendGifticon, myGifticon, buyedGifticonList } = require('../controller/service/gifticons')
const { authJWT } = require('../middleware/authJWT')
const router = express.Router()

router.post('/addgifticon', authJWT, addGifticon)

router.get('/', authJWT, getGifticonList)

router.post('/buy', authJWT, buyGifticon)

router.post('/send', authJWT, sendGifticon)

router.get('/my', authJWT, myGifticon)

router.get('/buy', authJWT, buyedGifticonList)

module.exports = router