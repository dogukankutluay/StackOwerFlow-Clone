const User=require("../models/Users");
const CustomError=require("../helpers/error/CustomError");
const asyncHandler=require("express-async-handler");

const blockUser=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    const user=await User.findById(id);
    user.blocked=!user.blocked;
    await user.save();
    return res.status(200)
    .json({
        success:true,
        message:"Block-Unblock Successful"
    });

});
const deleteUser=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    const user=await User.findById(id);
    await user.remove();
    return res.status(200)
    .json({
        success:true,
        message:"Delete User"
    });
});

 
module.exports={blockUser,deleteUser};

