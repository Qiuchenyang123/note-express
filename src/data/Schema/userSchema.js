const Schema = require('../mongoose').Schema;
const userSchema = new Schema({
    username: {
        type: String,
        // require: [true, '用户名是必须的'],
        minlength: 2,
        maxlength: 18
    },
    email: {
        type: String,
        // require: [true, '用户名是必须的'],
        minlength: 6,
        maxlength: 18
    },
    password: {
        type: String,
        require: [true, '密码必须'],
    },
    passTip: {
        type: String,
    },
    nickname: {
        type: String,
        // require: [true, '昵称必须']
    },
    avatar: {
        type: String,
        default: ''
    },
    date: {
        type: String,
        default: '' + Date.now()
    },
    phone: {
        type: Number,
        match: /^1[2-9]\d{9}/,
        // require: [true, '手机号是必须的']
    },

    article: [{
        type: Schema.Types.ObjectId,
        ref: 'article'
    }]
})

module.exports = userSchema