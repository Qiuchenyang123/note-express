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
    const {email, pass, avatar, nickname, phone} = req.body;
    console.log(email, pass, avatar, nickname, phone);
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
    if (!email || !pass) {
        // const captcha = svgCaptcha.create();
        // req.session.verificationCode = captcha.text.toLocaleLowerCase();
        res.send({
            code: 0,
            msg: '邮箱和密码是必须的',
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
                        email,
                        password: pass,
                        // avatar,
                        nickname,
                        phone,
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
    const { email, password } = req.body;
    userModel
        .findOne({ email })
        .then((data) => {
            if (data.password === password) {
                req.session.userInfo = {
                    id: data._id,
                    email: data.email
                };
                res.send({
                    code: 1,
                    success: true,
                    msg: '登录成功',
                    data: {
                        userInfo: {
                            id: data._id,
                            email: data.email
                        }
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

// 修改用户信息(除了用户名)
router.post('/update', (req, res) => {
    const { email, password, avatar } = req.body;
    userModel
        .updateOne({ email }, { password, avatar })
        .then(() => {})
});

module.exports = router;