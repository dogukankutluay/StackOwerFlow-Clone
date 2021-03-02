const express=require("express");


const user=require("./user");
const auth=require("./auth");
const question=require("./question");
const admin=require("./admin");

const router=express.Router();


router.use("/admin",admin);
router.use("/questions",question);
router.use("/auth",auth);
router.use("/users",user);

module.exports=router;