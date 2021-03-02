const multer=require("multer");
const CustomError=require("../../helpers/error/CustomError");
const path=require("path");
const { model } = require("mongoose");

// yapılacak işlem
//filefilter and storage

//storage nereye ve hangi isimle kayıt edileceğiniz belirleyecek
const storage=multer.diskStorage({
    
    //destination dosyanın nereye kayıt edileceğini söylecek
    destination:function (req,file,cb) {
        const rootdire=path.dirname(require.main.filename);
        cb(null,path.join(rootdire,"/public/uploads"));
    },
    // file name dosyaların hangi isimle kayıt edileceğini söyleyecek
    filename:function (req,file,cb) {
        const extension=file.mimetype.split("/")[1];
        req.savedProfileImage="image_"+req.user.id+"."+extension;
        cb(null,req.savedProfileImage);
    }

});
//filefilter da hangi dosyalara izin verileceğini belirtecek

const fileFilter=(req,file,cb)=>{
    let mimeTypes=["image/jpg","image/jpeg","image/gif","image/png"];
    if(!mimeTypes.includes(file.mimetype)){
        return cb(new CustomError("Please provide a valid image file",400),false);
    } 
    return cb(null,true);
};

const profileImageUpload=multer({storage,fileFilter});

module.exports=profileImageUpload;