const Question=require("../models/Questions");
const CustomError=require("../helpers/error/CustomError");
const asyncHandler=require("express-async-handler");
const Answer = require("../models/Answer");
const askNewQuestion=asyncHandler(async(req,res,next)=>{
    
    const {title,content}=req.body;
    
    const question=await Question.create({
        title:title,
        content:content,
        user:req.user.id,      
    });
    res.status(200)
    .json({
        success:true,
        data:question      
    });
});
const getAllAsks=asyncHandler(async(req,res,next)=>{

    return res.status(200).json(res.queryResult)
})
const getAskFromId=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    const question=await Question.findById(id);
    return res.status(200)
    .json({
        success:true,
        data:question
    })
})
const editQuestion=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    const {title,content}=req.body;
    let question=await Question.findById(id);
    question.title=title;
    question.content=content;
    question= await question.save();
    return res.status(200)
    .json({
        success:true,
        message:"İşlem Yapıldı",
        data:question
    })
});
const deleteQuestion=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    const question=await Question.findById(id);
    question.remove();
    return res.status(200)
    .json({
        success:true,
        message:"question is database remove"
    });
});
const likeQuestion=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    const question=await Question.findById(id);
    if(question.likes.includes(req.user.id)){
        return next(new CustomError("you already liked this question"),400);
    }
    question.likes.push(req.user.id);
    question.likecount=question.likes.length;
    await question.save();
    return res.status(200)
    .json({
        success:true,
        message:"you like this question"
    })
});
const undoLikeQuestion=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    const question=await Question.findById(id);
    if(!question.likes.includes(req.user.id)){
        return next(new CustomError("you can not undolike for this question"),400);
    }
    const index=question.likes.indexOf(req.user.id);
    question.likes.splice(index,1);
    await question.save();
    return res.status(200)
    .json({
        success:true,
        message:"like removed"
    })  
});
module.exports={
    undoLikeQuestion,likeQuestion,deleteQuestion,askNewQuestion,getAllAsks,getAskFromId,editQuestion
};