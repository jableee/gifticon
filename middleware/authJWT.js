const jwt = require('jsonwebtoken')

const authJWT = (req, res, next) => {
  if(req.headers.authorization) {
    const token = req.headers.authorization.split('Bearer ')[1]
    const result = jwt.decode(token, process.env.TOKENKEY)
    if(result) {
      req.id = result.id
      req.email = result.email
      req.name = result.name
      next()
    } else {
      res.status(401).send({
        ok: false,
        code: 90010,
        message: 'token err'
      })
    }
  } else {
    res.status(400).send({
      ok: false,
      message: 'need token'
    })
  }
}

module.exports = {
  authJWT
}