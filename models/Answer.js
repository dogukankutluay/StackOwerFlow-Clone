const mogoose=require("mongoose");
const Schema=mogoose.Schema;
const Question=require("../models/Questions");
const CustomError=require("../helpers/error/CustomError");
const AnswerSchema=new Schema({
    
    content:{
        type:String,
        required:[true,"Please provide a content"],
        minlength:[10,"Please provide a content at least 10 characters"]
    },
    creatat:{
        type:Date,
        default:Date.now
    },
    likes:[{
        type:mogoose.Schema.ObjectId,
        ref:"User"
    }],
    user:{
        type:mogoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    question:{
        type:mogoose.Schema.ObjectId,
        ref:"Question",
        required:true
    }
});
AnswerSchema.pre("save",async function(next){
    if(!this.isModified("user")){
        return next();
    }
    try {
        const question=await Question.findById(this.question);
        question.answer.push(this._id);
        question.answercount=question.answer.length;
        await  question.save();
        next();    
    } catch (error) {
        return next(error);
    }
    
})
AnswerSchema.post("remove",async function (next) {
    
})
module.exports=mogoose.model("Answer",AnswerSchema);