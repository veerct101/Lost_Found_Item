const jwt = require("jsonwebtoken")
require("dotenv").config();
const secret = "veerct";

function createTokenForUser(user)
{
    const payload = {
        _id : user._id,
        email : user.email,
        userName : user.userName
    }
    const token = jwt.sign(payload , secret);

    return token;
}

function validateToken(token)
{
    const payload = jwt.verify(token , secret)
    return payload
}

module.exports = {
    createTokenForUser,
    validateToken
}