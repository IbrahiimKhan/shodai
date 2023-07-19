const express = require("express")
const router = express.Router()
const{ requireSignin,isAuth,isAdmin} = require("../controller/auth")
const {findByUserId} = require("../controller/user")

const { create,categoryById ,getSingleCategory,updateCategory,deleteCategory,getAllCategory} = require("../controller/category")
router.post("/category/create/:userId",requireSignin,isAuth,isAdmin, create)
router.put("/category/:categoryId/:userId",requireSignin,isAuth,isAdmin, updateCategory)
router.delete("/category/:categoryId/:userId",requireSignin,isAuth,isAdmin, deleteCategory)
router.get("/category/:categoryId",getSingleCategory)
router.get("/categories",getAllCategory)
router.param("categoryId",categoryById)
router.param("userId",findByUserId)
module.exports = router