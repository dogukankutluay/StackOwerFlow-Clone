const Question=require("../models/Questions");
const CustomError=require("../helpers/error/CustomError");
const asyncHandler=require("express-async-handler");
const Answer=require("../models/Answer");

const addNewEnswerToQuestion=asyncHandler(async(req,res,next)=>{
    const {question_id}=req.params;
    const user_id=req.user.id;
    const information=req.body;

    const answer=await Answer.create({
        ...information,
        question:question_id,
        user:user_id
    });
    return res.status(200)
    .json({
        success:true,
        data:answer
    });
});
const getAllAnswers=asyncHandler(async(req,res,next)=>{
    const{question_id}=req.params;
    const question=await  Question.findById(question_id).populate("answer");
    return res.status(200)
    .json({
        success:true,
        count:question.answer.length,
        data:question.answer
    })
})
const getSingleAnswer=asyncHandler(async(req,res,next)=>{
    const {answer_id}=req.params;
    const answer=await  Answer.findById(answer_id)
    .populate({
        path:"question",
        select:"title"
    })
    .populate({
        path:"user",
        select:"name profile_image"
    });
    return res.status(200)
    .json({
        success:true,
        data:answer
    })
})
const editAnswer=asyncHandler(async(req,res,next)=>{
    const {answer_id}=req.params;
    const {content}=req.body;
    const answer=await Answer.findOneAndUpdate(answer_id);
    answer.content=content;
    asnwer=await answer.save();
    return res.status(200)
    .json({
        success:true,
        message:"işlem yapıldı",
        data:answer
    })
})
const deleteAnswer=asyncHandler(async(req,res,next)=>{
    const {answer_id}=req.params;
    const {question_id}=req.params;
    await Answer.findByIdAndDelete(answer_id);
    
    const question=await Question.findById(question_id);
    question.answer.splice(question.answer.indexOf(answer_id),1);
    question.answercount=question.answer.length;
    await question.save();
    return res.status(200)
    .json({
        succes:true,
        message:"delete answer"
    })
})
const likeAnswer=asyncHandler(async(req,res,next)=>{
    const {answer_id}=req.params;
    const answer=await Answer.findById(answer_id);
    if(answer.likes.includes(req.user.id)){
        return next(new CustomError("you already liked this answer"),400);
    }
    answer.likes.push(answer_id);
    question.answercount=question.answer.length;
    await answer.save();
    return res.status(200).json({
        success:true,
        message:"you like this asnswer"
    });
})
const unlikeAnswer=asyncHandler(async(req,res,next)=>{
    const {answer_id}=req.params;
    const answer=await Answer.findById(answer_id);
    if(!answer.likes.includes(req.user.id)){
        return next(new CustomError("you can not undolike for this answer",400));
    }
    answer.likes.splice(answer.likes.indexOf(req.user.id),1);
    await answer.save();
    return res.status(200)
    .json({
        success:true,
        message:"like removed"
    })
})
module.exports={likeAnswer,unlikeAnswer,addNewEnswerToQuestion,getSingleAnswer,getAllAnswers,editAnswer,deleteAnswer};