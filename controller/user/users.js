const User = require('../../schemas/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/**
 * signup
 * @param {email, passwrod, name} req 
 * @param {ok, message, newUser} res 
 * @returns 
 */
const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body

    //check email format
    let regex = new RegExp(`^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$`)
    let checkEmailFormat = regex.test(email)
    if(!checkEmailFormat){
      return res.status(400).send({
        ok: false,
        message: '이메일 형식을 확인해 주세요'
      })
    }

    //check email extis
    const existEmail = await User.findOne({ email })
    if(existEmail){
      return res.status(400).send({
        ok: false,
        message: '이미 회원가입된 이메일 입니다.'
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await new User({
      email,
      password: hashedPassword,
      name
    }).save()

    res.status(201).send({ ok: true, message: 'SUCCESS SIGNUP', user: newUser})
  } catch (err) {
    console.log(err)
    res.status(401).send(e)
  }
}
/**
 * signin
 * @param {email, password} req 
 * @param {*} res 
 */
const signin = async (req, res) => {
  const { email, password } = req.body

  try{
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const checkPass = await bcrypt.compare(password, hashedPassword)

    const user = await User.findOne({ email })

    if(!user || !checkPass ){
      return res.status(400).send({
        ok: false,
        message: 'please check email and password'
      })
    }

    const token = jwt.sign({ 
      id: user.id, 
      email, 
      name:user.name 
    }, 
    process.env.TOKENKEY, 
    { 
      expiresIn: '12h' 
    })

    res.status(200).send({
      token,
      id: user.id,
      ok: true, 
      message: 'success for signin'
    })
  } catch(e) {
    console.log(e)
    res.status(401).send(e)
  }
}

const pointCharge = async (req, res) => {
  
}

module.exports = {
  signup,
  signin
}