const mongoose = require('mongoose')

const connect = () => {
  mongoose
  .connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('success connect to mongodb'))
  .catch(e => console.log(e))
}

module.exports = connect