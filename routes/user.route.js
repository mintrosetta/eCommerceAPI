const router = require('express').Router();

// libraries
const verifyToken = require('./verifyToken');
const CryptoJS = require('crypto-js');

// models
const User = require('../models/user.model');

// dtos or enum
const ResponseDto = require('../dtos/response.dto');
const enumMessage = require('../enums/message.enum');


router.put("", [verifyToken], async (req, res) => {
    const { password } = req.body;
    console.log(req.body)
    console.log(req.user)
    let passwordHash = null;
    if (password) {
        passwordHash = CryptoJS.AES.encrypt(password, process.env.PASSWORD_SECRET).toString();
    }

    try {
        const user = await User.findByIdAndUpdate(req.user.id, {
            $set: {
                password: passwordHash
            }
        }, {new: true});

        return res.status(200).json(new ResponseDto(true, enumMessage.SUCCESS, user));
    } catch (ex) {
        console.log(ex.message);
        return res.status(400).json(new ResponseDto(false, enumMessage.FAIL, null));
    }
});

module.exports = router;