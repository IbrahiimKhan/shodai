const mongoose = require("mongoose")
const crypto = require("crypto")
const { v4: uuidv4 } = require('uuid');

//creating the user schema

const uesrSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxLength: 32,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    hashed_password: {
        type: String,
        required: true,
    },
    salt: String,
    role: {
        type: Number,
        default: 0,

    },
    history: {
        type: Array,
        default: []
    }

}, { timestamps: true })

//virtual field to handle hashed password
uesrSchema.virtual("password")
    .set(function (password) {
        this._password = password
        this.salt = uuidv4()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })

//method to encrypt password

uesrSchema.methods = {
    authenticate:function (plainText) {
      return this.encryptPassword(plainText)=== this.hashed_password  
    },
    encryptPassword: function (password) {
        if (!password) return;
        try {
            return crypto.createHmac("sha1", this.salt)
                .update(password)
                .digest("hex")
        } catch (error) {
            return ""
        }
    }
}


module.exports = mongoose.model("User", uesrSchema)