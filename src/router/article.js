const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require('path');
const articleModel = require("../data/Model/articleModel");

// C:\codeplace\note-express\src\assets\img\surface
// 设置 multer 存储空间
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(cb);
        cb(null, path.resolve(__dirname, '../assets/img/surface'))
    },
    filename: function (req, file, callback) {
        console.log(13, file)
        const {ext} = path.parse(file.originalname);
        const filename = file.fieldname + '-' + Date.now() + ext;
        req.session.newSurfaceName = filename;
        callback(null, filename)
    }
});
// 配置 multer
const myUpload = multer({
    storage, // 存储空间
    limits: { // 限制
        fileSize: 100 * 1024 * 1024
    },
    fileFilter(req, file, callback) {
        console.log(27, file);
        const {ext} = path.parse(file.originalname);
        callback(null, /\.jpg|\.png|\.jpeg|\.gif$/.test(ext))
    }
}).single('surface');

router.post('/articleSurfaceUpload', (req, res) => {
    myUpload(req, res, function (err) {
        console.log(57)
        if (err instanceof multer.MulterError) {
            return res.send({
                code: 0,
                msg: `multer错误:${err}`
            })
        } else if (err) {
            return res.send({
                code: 0,
                msg: `非multer错误：${err}`
            })
        }

        res.send({
            code: 1,
            msg: '上传成功',
            data: {
                surfaceUrl: 'http://localhost:23333/img/surface/' + req.session.newSurfaceName
            }
        })
    })

    // if (req.session.userInfo.id) {
    // }
});
// 单个文件.single('file')

router.get('/articleList', (req, res) => {
    articleModel.find()
        .then(data => {
            res.send({
                code: 1,
                msg: '成功获取文章列表',
                data
            })
        })
        .catch(err => {
            res.send({
                code: 0,
                msg: err,
            })
        })
});

router.get('/articleInfo', (req, res) => {

});

/*
router.post('/articleSurfaceUpload2', myUpload2.single('file'), (req, res) => {
    res.send({
        code: 1,
        msg: '上传成功',
        data: {
            file: req.file
            // surfaceUrl: 'http://localhost:23333/assert/img/surface/' + req.session.newSurfaceName
        }
    })
});
*/

router.post('/addArticle', (req, res) => {
    const {title, content, origin, surface, tag, description} = req.body;
    if (!title || !content || !origin || !tag) {
        res.send({
            code: 0,
            msg: '文章标题、内容、类型、标签是必须的',
        })
    }
    console.log(req.session);
    const author = req.session.userInfo.id;
    articleModel.create({
        title, content, origin, surface, tag, description, author
    })
        .then(() => {
            res.send({
                code: 1,
                msg: '创建成功'
            })
        })
        .catch(err => {
            res.send({
                code: 0,
                msg: '创建失败：' + err
            });
            console.log(err)
        })
});

module.exports = router;