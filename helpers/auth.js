const jwt = require('jsonwebtoken')

module.exports = {
  auth: (req, res, next) => {
    const decode = jwt.verify(process.env.ADMIN_SECRET_KEY, process.env.JWT_SECRET_KEY)
    if (decode.role === 'Admin') {
      next()
    } else {
      res.status(401).json({
        message: "Anda tidak memiliki akses ke web ini!"
      })
    }
  }
}