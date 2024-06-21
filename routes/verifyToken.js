const jwt = require("jsonwebtoken");
const ResponseDto = require('../dtos/response.dto');
const enumMessage = require('../enums/message.enum');

const verifyToken = (req, res, next) => {
    const token = req.headers.token;

    if (!token) return res.status(401).json(new ResponseDto(false, enumMessage.CREDENTIALS_INVALID, null));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(401).json(new ResponseDto(false, enumMessage.CREDENTIALS_TOKEN_INVALID, null));
    
        req.user = user;
        next();
    });
}

module.exports = verifyToken;