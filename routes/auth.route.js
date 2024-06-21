// libraries
const router = require('express').Router();
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

// models
const User = require('../models/user.model');

// dtos or enum
const ResponseDto = require('../dtos/response.dto');
const enumMessage = require('../enums/message.enum');

// register
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    const passwordHash = CryptoJS.AES.encrypt(password, process.env.PASSWORD_SECRET).toString();
    const user = new User({
        username: username,
        email: email,
        password: passwordHash
    });

    try {
        const userSaved = await user.save();
        return res.status(201).json(new ResponseDto(true, enumMessage.SUCCESS, userSaved));
    } catch (ex) {
        console.log(ex.message);
        return res.status(400).json(new ResponseDto(false, enumMessage.FAIL, null));
    }   
});

// login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: username });

        const currentPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET).toString(CryptoJS.enc.Utf8);

        if (password != currentPassword) throw new Error(enumMessage.CREDENTIALS_INVALID);

        const payload = {
            id: user._id,
            isAdmin: user.isAdmin
        };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "3d" });

        return res.status(200).json(new ResponseDto(true, enumMessage.SUCCESS, accessToken));
    } catch (ex) {
        console.log(ex.message);
        return res.status(400).json(new ResponseDto(false, enumMessage.FAIL, null));
    }
});

module.exports = router; 