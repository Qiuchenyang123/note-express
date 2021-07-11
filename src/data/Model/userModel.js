const userSchema = require("../Schema/userSchema")
const model = require("../mongoose").model;

const userModel = model('users', userSchema)

module.exports = userModel
