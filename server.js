const express=require("express");
const dotenv=require("dotenv");
const routers=require("./routers/index");
const customErrros=require("./middlewares/errors/customErrorHunduler");
const connectDatabase=require("./helpers/database/connectDatabase");
const cookieParser=require("cookie-parser");
const path=require("path");
var cors = require('cors')
const expressLayouts=require("express-ejs-layouts");
dotenv.config({
    path:"./config/env/config.env"
});



//mongodb connection
connectDatabase();

//app open server
const app=express();
app.use(cors())

app.use(cookieParser());
//ejs
app.use(expressLayouts);
app.set('view engine','ejs');

//body middlewar
app.use(express.json());
app.use(express.urlencoded({extended:false}));
// port 

const PORT=5000||process.env.PORT;

//routers middleware 

app.use("/api",routers);

//static files

app.use(express.static(path.join(__dirname,"public")));
//err middleware
app.use(customErrros);
app.listen(PORT,()=>{
    console.log("Server Started" +" "+process.env.PORT);
});

