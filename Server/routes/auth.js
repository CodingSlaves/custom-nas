const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

router.post('/login', (req, res) => {
    const {
        username,
        PW
    } = req.body
    const secret = req.app.get('jwt-secret');

    User.findOneByUsername(username)
        .then((result) => {
            if (!result) throw new Error('User is not registered');
            else return result;
        })
        .then(result => {
            result.comparePW(PW)
                .then((isMach) => {
                    if (isMach) {
                        jwt.sign({
                                _id: this._id,
                                username: this.username
                            },
                            process.env.SECRET, {
                                expiresIn: '1d',
                                issuer: process.env.ORIGIN,
                                subject: 'userInfo'
                            },
                            (err, token) => {
                                if (err) throw err;
                                else res.json({
                                    message: 'login success',
                                    token
                                });
                            });
                    } else throw new Error('login failed');
                })
                .catch(err=> {throw err});
        })
        .catch(err => {
            res.status(403).json({
                message: err.message
            });
        })
});

router.post('/register', (req, res) => {
    const {
        username,
        PW
    } = req.body;
    User.findOneByUsername(username)
        .then(result => {
            if (result) throw new Error('Already exist username');
            else return User.create(username, PW)
        })
        .then(result => {
            res.json({
                message: "welcome" + result.username,
                register: true
            });
        }).catch(err => {
            res.status(409).json({
                message: err.message
            });
        });
});

router.get('/check', (req, res) => {
    const token = req.headers['authorization']
    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'login failed'
        });
    }
    const p = new Promise((resolve, reject) => {
        jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
            if (err) reject(err);
            resolve(decoded);
        });
    });
    p.then(token => {
            res.json({
                success: true,
                info: token
            })
        })
        .catch(err => {
            res.status(403).json({
                success: false,
                message: err.message
            });
        });
});

router.delete('/:id', (req, res) => {

});

module.exports = router;