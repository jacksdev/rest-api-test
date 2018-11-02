
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const User = require('./Models/User')


exports.authenticate = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {

      const user = await User.findOne({email})

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch){
          resolve(user);
        }else{
          reject('Authentication failed')
        }
      })
    }catch (err) {
      reject('Authentication failed')
    }
  })
}
