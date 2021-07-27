const express = require("express")
const router = express.Router();
const path = require('path');
const userModel = require('../data/Model/userModel');
// 用于验证码
const svgCaptcha = require("svg-captcha");


/*
* code: 0——失败，1——成功
* msg： 错误信息
* data： 数据
* */
// 获取验证码
router.get('/verificationCode', (req, res) => {
    const captcha = svgCaptcha.create();
    req.session.verificationCode = captcha.text.toLocaleLowerCase();
    res.send({
        code: 1,
        msg: '',
        data: {
            svg: captcha.data
        }
    })
});

// 注册用户
router.post('/register', (req, res) => {
    const {username, email, pass, avatar, nickname, phone, passTip} = req.body;
    console.log(username, email, pass, avatar, nickname, phone);
    /* let verificationCode = req.body.verificationCode;
     verificationCode = verificationCode ? verificationCode.toLocaleLowerCase() : verificationCode;
     if (verificationCode !== req.session.verificationCode) {
         const captcha = svgCaptcha.create();
         req.session.verificationCode = captcha.text.toLocaleLowerCase();
         res.send({
             code: 0,
             errMsg: 'verificationCodeError',
             msg: '验证码错误',
             data: {
                 svg: captcha.data
             }
         })
     }*/
    if (!username || !email || !pass) {
        // const captcha = svgCaptcha.create();
        // req.session.verificationCode = captcha.text.toLocaleLowerCase();
        res.send({
            code: 0,
            msg: '用户名、' +
                '邮箱和密码是必须的',
            data: {
                // svg: captcha.data
            }
        })
    }
    userModel
        .findOne({email})
        .then((data) => {
            if (data) {
                const captcha = svgCaptcha.create();
                // req.session.verificationCode = captcha.text.toLocaleLowerCase();
                res.send({
                    code: 0,
                    msg: '邮箱已被注册。',
                    data: {
                        // svg: captcha.data
                    }
                })
            } else {
                userModel
                    .create({
                        username,
                        email,
                        password: pass,
                        avatar,
                        nickname,
                        phone,
                        passTip
                        // verificationCode
                    })
                    .then(() => {
                        res.send({
                            code: 1,
                            msg: '注册成功'
                        })
                    })
                    .catch(err => {
                        console.log('创建用户错误：' + err)
                    })
            }
        })
        .catch((err) => {
            console.log('用户注册错误：' + err)
        })
});
// 用户登录
router.post('/login', (req, res) => {
    const { username, email, pass } = req.body;
    userModel
        .findOne({ username })
        .then((data) => {
            if (data.password === pass) {
                req.session.userInfo = data;
                res.send({
                    code: 1,
                    success: true,
                    msg: '登录成功',
                    data: {
                        userInfo: data
                    }
                });

                /*if (data.status === 1) {
                } else {
                    res.send({
                        code: 1,
                        success: true,
                        msg: '登录失败，账号未启用'
                    })
                }*/
            } else {
                res.send({
                    code: 1,
                    success: true,
                    msg: '账号或密码错误'
                })
            }
        })
        .catch(err => {
            res.send({
                code: 0,
                success: false,
                errMsg: '报错，err：' + err
            })
        })
});

// 用户信息
router.get('/getUserInfo', (req, res) => {
    res.send({
        code: 1,
        data: {
            userInfo: req.session.userInfo
        }
    })
})

// 修改用户信息(除了用户名)
router.post('/update', (req, res) => {
    const { username, email, pass, avatar, nickname, phone, passTip } = req.body;
    userModel
        .updateOne({ username }, { password: pass, avatar, nickname, phone, passTip })
        .then(() => {})
});

module.exports = router;