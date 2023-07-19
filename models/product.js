const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema
//console.log(ObjectId)
//creating the user schema

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxLength: 32,
    },
    description: {
        type: String,
        
      
        maxLength: 2000,
    },
    price: {
        type: Number,
        trim: true,
        required: true,
        maxLength: 32,
    },
    category: {
        type: ObjectId,
        ref:"Category",

        required:true,
    },
    quantity:{
        type:Number,

    },
    sold:{
        type:Number,
        default:0
    },
    photo:{
        
        data:Buffer,
        contentType:String,
       
    },
    shipping:{
        required:false,
        type:Boolean
    }
   
}, { timestamps: true })
productSchema.index({name:"text",description:"text"})
module.exports = mongoose.model("Product", productSchema)