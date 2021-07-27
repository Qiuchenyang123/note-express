const mongoose = require("mongoose");
const articleSchema = require("../schema/articleSchema");

const articleModel = mongoose.model('articles', articleSchema);

module.exports = articleModel;