const mongoose=require("mongoose");

const connetDatabase=()=>{

    mongoose.connect(process.env.MONGO_URI, { 
        useNewUrlParser: true,
        useFindAndModify:false,
        useCreateIndex:true,
        useUnifiedTopology:true })
    .then(()=>{
        console.log("MongoDB Connetion successful")
    })
    .catch(err=>console.error(err))
}


module.exports=connetDatabase;