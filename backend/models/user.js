const mongoose = require("mongoose");
const { model } = require("mongoose");
const {createHmac , randomBytes} = require('crypto');
const {createTokenForUser} = require('../services/authentication');

const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    salt : {
        type : String
    },
    password : {
        type : String,
        required : true
    },
}, {
    timestamps : true
});


userSchema.pre("save", async function () {
  const user = this;

  if (!user.isModified("password")) return;

  const SecSalt = randomBytes(16).toString("hex");

  const hashedPW = createHmac("sha256", SecSalt)
    .update(user.password)
    .digest("hex");

  user.password = hashedPW;
  user.salt = SecSalt;
});

userSchema.statics.matchPasswordAndGenToken = async function (
  email,
  password
) {
  const user = await this.findOne({ email });

  if (!user) throw new Error("User not found");

  const UserPass = createHmac("sha256", user.salt)
    .update(password)
    .digest("hex");

  if (UserPass !== user.password)
    throw new Error("Invalid password");

  const token = createTokenForUser(user);

  return token;
};

const USER = mongoose.model("user" , userSchema);

module.exports = USER;