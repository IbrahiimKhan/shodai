const express = require("express")
const router = express.Router()
const{ requireSignin,isAuth,isAdmin} = require("../controller/auth")
const {findByUserId} = require("../controller/user")
const {create,findProductById,getSingleProduct,deleteProduct,updateProduct,getAllProducts,getRelatedProducts, getProductsByCategory,getProductPhoto,getProductsByCategories} = require("../controller/product")

//product routes
router.get("/product/:productId",getSingleProduct)
router.get("/products",getAllProducts)
router.get("/products/related/:productId",getRelatedProducts)
router.get("/products/category/:categoryId",getProductsByCategory)
router.post("/products/categories", getProductsByCategories);
router.get("/product/photo/:productId",getProductPhoto)
router.post("/product/create/:userId",requireSignin,isAuth,isAdmin, create)
router.delete("/product/:productId/:userId",requireSignin,isAuth,isAdmin, deleteProduct)
router.patch("/product/:productId/:userId",requireSignin,isAuth,isAdmin, updateProduct)
router.param("userId",findByUserId)
router.param("productId",findProductById)
module.exports = router