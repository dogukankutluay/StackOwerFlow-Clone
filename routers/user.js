const express=require("express");
const User=require("../models/Users");
const router=express.Router();
const {checkUserExist}=require("../middlewares/database/databaseErrorHelpers");
const {getSingleUser,getAllUsers}=require("../controllers/user.js");
const {userQueryMiddleWare}=require("../middlewares/query/userQueryMiddleWare");


router.get("/:id",checkUserExist, getSingleUser)
router.get("/",userQueryMiddleWare(User),getAllUsers);
module.exports=router;