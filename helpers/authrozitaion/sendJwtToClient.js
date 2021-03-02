const sendJwtToClient= (user ,response) =>{
    const token=user.generateTokenJwt();
    console.log(token);
    const {JWT_COOKIE,NODE_ENV}=process.env;
    return response
    .status(200)
    .cookie("access_token=",token,{
        httpOnly:true,
        expires:new Date(Date.now()+parseInt(JWT_COOKIE)*1000*60),
        secure:NODE_ENV==="development" ? false :true,
        
        
    })
    .json({
         succes:true,
         acces_token:token,
         data:{
              name:user.name,
              email:user.email
         }
      })
   
};

const isTokenIncluded=req=>{
        
    // return req.headers.authorization && req.headers.authorization.startsWith("Bearer:");
    return  req.headers.cookie && req.headers.cookie.startsWith("acces_token=");
}
const getAccessTokenFromHeader=req=>{
    console.log("get acces");
    const authorization=req.headers.cookie;
    console.log(authorization);
    const accessToken=authorization.split("acces_token=")[1];
    console.log("toke"+accessToken);
    return accessToken;
    
}
module.exports={sendJwtToClient,getAccessTokenFromHeader,isTokenIncluded};