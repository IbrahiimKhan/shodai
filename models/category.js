const mongoose = require("mongoose")

//creating the user schema

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxLength: 32,
    },
   
}, { timestamps: true })

module.exports = mongoose.model("Category", categorySchema)