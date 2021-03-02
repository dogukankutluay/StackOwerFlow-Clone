const CustomError=require("../../helpers/error/CustomError");
const User=require("../../models/Users");
const Question=require("../../models/Questions");
const Answer=require("../../models/Answer");
const asyncHandler=require("express-async-handler");
const {isTokenIncluded,getAccessTokenFromHeader}=require("../../helpers/authrozitaion/sendJwtToClient");
const jwt=require("jsonwebtoken");
const getAccessToRoute=(req,res,next)=>{
    const {JWT_SECRET}=process.env;
    if(!isTokenIncluded(req)){
        return next(new CustomError("You Are not  authorized to access this route11"),401);
    }    
    const accessToken=getAccessTokenFromHeader(req);
    console.log("diğer token1 "+accessToken)
    jwt.verify(accessToken,JWT_SECRET,(err,decoded)=>{
        if(err){
            return next(new CustomError("You are not autohrized to access this route",401));
        }
        req.user={
            id:decoded.id,
            name:decoded.name
        };
        
    next();
    });
};
const getAdminAccess=asyncHandler(async(req,res,next)=>{
    const {id}=req.user;
    const user=await User.findById(id);
    if(user.role!=="admin"){
        return next(new CustomError("Only Admins can access this rooute ",403));
    }
    // accces den gelen id yi req ile yakaladığımızda eğer role admin değilse bizim routerımıza giremeyecek
    // bunu yukarıda if ile yakalaybiliyoruz 
    // yakaladığımızda next ile bu funcşton async yapısından cıkartırıyoruz middleware daha doğrusu
    // şu an yazılacak kodlar ile de adminse işlenecek kodlar diyebiliriz 
    //yakalanan kodları aslında tek adımda next ile yukarıdan aşşağı göndermiş olabiliyoruz şu an verilecek rooute göre hareket edecek

    next();
});
const getQuestionOwnerAccess=asyncHandler(async(req,res,next)=>{
    const userId=req.user.id;
    const questionId=req.params.id;
    const question=await Question.findById(questionId);
    if(question.user!=userId){
        return next(new CustomError("Only owner can handel this operation",403))
    }
    next();
})
const getAnswerOwnerAccess=asyncHandler(async(req,res,next)=>{
    const userId=req.user.id;
    const {answer_id}=req.params;
    const answer =await Answer.findById(answer_id);
    if(answer.user!=userId){
        return next(new CustomError("Only owner can handel this operation",403))
    }
    next();
})


module.exports={getAccessToRoute,getAdminAccess,getQuestionOwnerAccess,getAnswerOwnerAccess};