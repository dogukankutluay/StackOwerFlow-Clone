const slugify=require("slugify");
const mogoose=require("mongoose");
const Schema=mogoose.Schema;
const QuestionSchema=new Schema({
    title:{
        type:String,
        required:[true,"please provide title"],
        minlength:[10,"pelease provide add lest 10 lenght"],
        unique:true

    },
    content:{
        type:String,
        required:[true,"please probide content"],
        minlength:[20,"please  provide a title at least 20 length"],
        
    },
    slug:{
        type:String
    },
    createAt:{
        type:Date,
        default:Date.now()
    },
    user:{
        type:mogoose.Schema.ObjectId,
        required:true,
        ref:"User"
    },
    likes:[
        {
            type:mogoose.Schema.ObjectId,
            ref:"User"
        }
    ],
    answer:[{
        type:mogoose.Schema.ObjectId,
        ref:"Answer"
    }],
    answercount:{
        type:Number,
        default:0
    },
    likecount:{
        type:Number,
        default:0
    }
});
QuestionSchema.pre("save",function (next) {
    if(!this.isModified("title")){
        next();
    }
    this.slug=this.makeSlug();
    next();
})
QuestionSchema.methods.makeSlug=function () {
    return slugify(this.title, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove:  /[*+~.()'"!:@]/g, // remove characters that match regex, defaults to `undefined`
        lower: true,      // convert to lower case, defaults to `false`
      });
};

module.exports=mogoose.model("Question",QuestionSchema);