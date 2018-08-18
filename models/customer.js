const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const customerSchema = mongoose.Schema({
  fullname: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    unique: true
  },
  role: {
    type: String,
    default: 'Customer'
  },
  password: {
    type: String,
    require: true,
    validate: {
      validator: pass => {
        let regex = /^(?=.{5,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W])/;
        return regex.test(pass);
      },
      message:"Password must have one uppercase, lowercase, number, and a minimum length of 6 characters"
    }
  },
  listItemCustomer: [],
}, {
  timestamps: true
})

customerSchema.pre("save", function(next) {
  const saltRounds = 10;
  bcrypt
    .hash(this.password, saltRounds)
    .then(hash => {
      this.password = hash;
      next();
    })
    .catch(err => {
      console.log(err.message);
    });
});

module.exports = mongoose.model('Customer', customerSchema)