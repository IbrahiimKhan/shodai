const express = require("express")
require("dotenv").config()
const mongoose = require("mongoose")
const authRoute = require("./routes/auth")
const morgan = require("morgan")
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const expressValidator = require("express-validator")
const userRoute = require("./routes/user")
const categoryRoute = require("./routes/category")
const productRoute = require("./routes/product")
const braintreeRoute = require("./routes/braintree")
 const orderRoute = require("./routes/order")
const app = express()
//connecting to mongdb
const mongo_url = process.env.MONGO_URL
mongoose.connect(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("connected db")
}).catch(e => console.log("connection error", e))
//middleware
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())
app.use(cors())
//routes
app.use("/api", authRoute)
app.use("/api", userRoute)
app.use("/api", categoryRoute)
app.use("/api",productRoute)
app.use("/api",braintreeRoute)
 app.use("/api",orderRoute)
const port = process.env.PORT || 8000
app.listen(process.env.PORT || 8000,"0.0.0.0", () => {
    console.log(`listening from the port ${port}`)
})