const express=require("express");
const {getAccessToRoute,getAdminAccess}=require("../middlewares/autharization/auth");
const {blockUser,deleteUser}=require("../controllers/admin");
const {checkUserExist}=require("../middlewares/database/databaseErrorHelpers");
const router=express.Router();

router.use([getAccessToRoute,getAdminAccess]);

//block user
router.get("/block/:id",checkUserExist,blockUser);
//delete user
router.delete("/delete/:id",checkUserExist,deleteUser);



module.exports=router;