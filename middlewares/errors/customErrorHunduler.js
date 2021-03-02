
const CustomError=require("../../helpers/error/CustomError");
const customErrros=(err,req,res,next)=>{
    let errors=[];
    let customError=err;
    console.log(err);
    if(err.name==="CastError"){
        customError=new CustomError("Cast error please provide a valid id ",400);
    }
    if(err.name==="ValidationError"){
        res.status(200).json({success:false,err:"Please enter your password at least 6 characters."})
    }
    if(err.name==="SyntaxError"){
        customError=new CustomError("SyntaxError Error",400);
    }
     if(err.code===11000){
        res.status(200).json({success:false,err:"This email is in use"})
     }
     if(errors.length>0){
        res.render("register",{
            errors
        })
    }
    res
    .status(customError.status||500)
    .json({
        success:false,
        message:customError.message
    });
};

module.exports=customErrros;