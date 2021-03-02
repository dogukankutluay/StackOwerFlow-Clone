const User=require("../../models/Users");
const asyncHandler=require("express-async-handler");
const CustomError=require("../../helpers/error/CustomError");
const Question=require("../../models/Questions");
const Answer=require("../../models/Answer");

const checkUserExist=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    const user=await User.findById(id);
    if(!user){
        return next(new CustomError("there is no  such user with that id",400));
    }
    next();
});
const checkAskExist=asyncHandler(async(req,res,next)=>{
    const question_id=req.params.id||req.params.question_id;
    const question=await Question.findById(question_id);
    if(!question){
        return next(new CustomError("there is no such ask with that id",400));
    }
    next();
});
const checkAnswerExist=asyncHandler(async(req,res,next)=>{
    const {answer_id}=req.params;
    const {question_id}=req.params;
    const answer=await Answer.findOne({
        _id:answer_id,
        question:question_id
    });
    if(!answer){
        return next(new CustomError("there is no such ansswer with that id",400));
    }
    next();
})
module.exports={checkAnswerExist,checkUserExist,checkAskExist};

