const express=require("express");
const {forgotPassword,editDetails,getUser1,register,resetPassword,getUser,login,logout,imageUpload}=require("../controllers/auth");
const {getAccessToRoute}=require("../middlewares/autharization/auth");
const profileImageUpload=require("../middlewares/libraries/profileImageUpload");
const cookieParser=require("cookie-parser");

const router=express.Router();
router.use(cookieParser());
router.post("/login",login)
router.post("/register",register);
router.get("/profile",getAccessToRoute,getUser);
router.get("/logout",getAccessToRoute,logout);
router.post("/upload",[getAccessToRoute,profileImageUpload.single("profile_image")],imageUpload);
router.post("/forgotpassword",forgotPassword);
router.put("/resetpassword",resetPassword);
router.get("/resetpassword",function (req,res,next){
    res.render("resetpassword");
});

router.put("/edit",getAccessToRoute,editDetails)
module.exports=router;