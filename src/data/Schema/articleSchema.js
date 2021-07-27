const Schema = require("mongoose").Schema;
const articleSchema = new Schema({
    title: {
        type: String,
        require: [true, '标题是必须的'],
        minlength: 1,
        maxlength: 30,
    },
    tag: {
        type: String,
        require: [true, 'tag是必须的']
    },
    date: {
        type: Date,
        default: Date.now()
    },
    surface: {
        type: String,
        default: 'http://localhost:23333/assert/img/js.jpg'
    },
    origin: {
        type: String,
        require: true
    },
    description: {
        type: String,
    },
    content: {
        type: String,
        require: true
    },
    pv: {
        type: Number,
        default: 0
    },
    comment: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});

module.exports = articleSchema;