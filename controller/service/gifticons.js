const Gifticon = require('../../schemas/gifticon')
const jwt = require('jsonwebtoken')
const User = require('../../schemas/users')
const purchased_gifticon = require('../../schemas/purchased_gifticon')
const dayjs = require('dayjs')
const mongoose = require('mongoose')
const users = require('../../schemas/users')

/**
 * 새 키프티콘 등록하기
 * @param {name, bar_code, image_url, price, provider } req 
 * @param {ok, message, Gifticon} res 
 */
const addGifticon = async (req, res) => {
  const { name, bar_code, image_url, price, provider } = req.body

  try {
    const checkExistName = await Gifticon.findOne({ name })
    if(checkExistName){
      return res.status(400).send({
        ok: false,
        message: 'name is already exist'
      })
    }

    if(!bar_code || !image_url || !price || !provider) {
      return res.status(400).send({
        ok: false,
        message: 'need check info of gifticon'
      })
    }

    const gifticon = await new Gifticon({
      name,
      bar_code,
      image_url,
      price,
      provider
    }).save()

    res.status(200).send({
      ok: true, 
      message: 'success for add gifticon',
      gifticon
    })
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
  
}

/**
 * 기프티콘 목록 조회
 * @param {} req 
 * @param {*} res 
 */
const getGifticonList = async (req, res) => {
  // 기프티콘 목록 조회
  // 추후에 기프티콘 카테고리 분류 후 검색 필터링 기능 추가
  try {
    const list = await Gifticon.find({})

    res.status(200).send({
      ok: true,
      messgae: 'success for search',
      list
    })
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
}

/**
 * 기프티콘 구매
 * @param {G_id} req 
 * @param {*} res 
 */
const buyGifticon = async (req, res) => {
  // jwt 인증 미들웨어 처리 ok 
  // 여기서 유저가 키프티콘 구매하고, 그 정보가 purcahsed_gfticon에 저장된다.
  const { id } = req
  const { G_id } = req.body

  try {

    const user = await User.findOne({ _id: id })

    const gifticon = await Gifticon.findOne({ _id:G_id })
    if(!gifticon) {
      return res.status(400).send({
        ok: false,
        message: 'failed buy'
      })
    }

    if(gifticon.price > user.point.cash) {
      return res.status(400).send({
        ok: false, 
        message: 'need more cash'
      })
    }

    const buyed = await purchased_gifticon.create({
      g_id: gifticon._id,
      gifticon: gifticon,
      buyer_id: id,
      issued_date: new Date(dayjs()),
      expiration_date: new Date(dayjs().add(30, 'day')),
      is_used: false,
      receiver: null
    })
    await user.updateOne({
      $inc: { 'point.cash': -gifticon.price }
    })

    res.status(200).send({
      ok: true,
      message: 'success for buy',
      buyed
    })

  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
}

const buyedGifticonList = async (req, res) => {
  const { id } = req

  try {

    const buyed = await purchased_gifticon.find({ buyer_id: id })
    
    res.status(200).send({
      ok: true,
      message: 'success for search',
      result: buyed
    })
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
}

/**
 * 기프티콘 전송
 * @param {*} req 
 * @param {*} res 
 */
const sendGifticon = async (req, res) => {
  // 위에서 생성된 기프티콘이 발신자가 발송 할수 있게 하기 ( 수신자 입력 받아서 )
  const { id } = req
  const { purchased_id, receiver } =  req.body

  try {

    const material = await purchased_gifticon.findOne({ _id: purchased_id })

    const O_receiver_id = new mongoose.Types.ObjectId(receiver)
    const receive_user = await users.findOne({ _id: O_receiver_id })

    if(receive_user){
      await material.updateOne({ $set: { receiver: receiver } })
    } else {
      return res.status(400).send({
        ok: false, 
        message: 'cannot find receiver info'
      })
    }

    res.status(200).send({
      ok: true,
      message: 'success for send',
      result: material
    })

  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }

}

/**
 * 나의 기프티콘 조회
 * @param {} req 
 * @param {*} res 
 */
const myGifticon = async (req, res) => {
  const { id } = req

  try { 
    const received_gifticon = await purchased_gifticon.find({receiver: id})

    res.status(200).send({
      ok: true,
      message: 'success for search',
      result: received_gifticon
    })
  } catch (e) {
    console.log(e);
    res.status(400).send(e)
  }
}

// 기프티콘 관리하기 ( 기간 연장 )

module.exports = {
  addGifticon,
  buyGifticon,
  sendGifticon,
  getGifticonList,
  myGifticon,
  buyedGifticonList
}