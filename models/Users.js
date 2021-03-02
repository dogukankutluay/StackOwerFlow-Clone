const mogoose=require("mongoose");
const jwt=require("jsonwebtoken");
var bcrypt = require('bcryptjs');
const crypto=require("crypto");
const Question=require("../models/Questions");
const Schema=mogoose.Schema;

const UserSchema=new Schema({
    name:{
        type:String,
        required:[true,"Please proivde a name"]
    },
    email:{
        type:String,
        required:[true,"Please provide a email"],
        unique:true,
        match:[
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "Please provide a valid email"
        ]

    },
    role:{
        type:String,
        default:"user",
        enum:["user","admin"]
    },
    password:{
        type:String,
        minlength:[6,"Please proivde a password  with  min length 6"],
        required:[true,"Please provide a password"],
        select:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    title:{
        type:String
    },
    abaout:{
        type:String
    },
    place:{
        type:String
    },
    website:{
        type:String
    },
    profile_image:{
        type:String,
        default:"default.jpg"
    },
    blocked:{
        type:Boolean,
        default:false
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpire:{
        type:Date
    }
});

UserSchema.methods.generateTokenJwt=function () {
    const {JWT_SECRET,JWT_EXPIRE}=process.env;
    const payloud={
        id:this._id,
        name:this.name
    };
    const token=jwt.sign(payloud,JWT_SECRET,{
        expiresIn:JWT_EXPIRE,
        algorithm:"HS256",
    });
    return token;
}
UserSchema.methods.getResetPasswordTokenFromUser=function () {
    const randomHexString=crypto.randomBytes(15).toString("hex");
    const {RESET_PASSWORD_EXPIRE}=process.env;
    const resetPasswordToken=crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");
    this.resetPasswordToken=resetPasswordToken;
    this.resetPasswordExpire=Date.now()+parseInt(RESET_PASSWORD_EXPIRE);
    return resetPasswordToken;
};
UserSchema.pre("save",function(next) {   
    if(!this.isModified("password")){
        next();
    }  
    bcrypt.genSalt(10, (err, salt)=> {
        if(err) next(err);
        bcrypt.hash(this.password, salt, (err, hash)=> {
            if(err) next(err);
            this.password=hash;
            
            next();    
        });
    });
});
UserSchema.post("remove",async function (next){
    await Question.deleteMany(
        {
            user:this._id
        });
})
module.exports=mogoose.model("User",UserSchema);