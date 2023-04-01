const User = require('../../schemas/users')

const mongoose = require('mongoose')

const charge = async (req, res) => {
  const { id, name, email } = req
  const { cash } = req.body
  try {

    await User.updateOne(
      { _id: id },
      { 
        $set: { 'point.updatedAt': new Date() },
        $inc: { 'point.cash': cash },
      }, 
    )

    const test = await User.findOne({ _id: id })
    res.status(200).send({
      test,
      ok: true,
      message: 'success for update'
    })

  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
}

module.exports = {
  charge
}