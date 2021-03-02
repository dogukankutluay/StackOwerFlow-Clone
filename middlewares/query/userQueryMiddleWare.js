const asyncHandler=require("express-async-handler");
const {searchHelper,paginationHelper} = require("./questionQuerySearchHelpers");
const userQueryMiddleWare=function (model,options) {
    return asyncHandler(async function(req,res,next){
        let query=model.find();
        query=searchHelper("name",query,req);
        const paginationResult=await paginationHelper(query,req,model);
        query=paginationResult.query;
        const pagination=paginationResult.pagination;
        const queryResult=await query;

        res.queryResult={
            success:true,
            count:queryResult.length,
            pagination:pagination,
            data:queryResult
        }
        next();
    })

}

module.exports={userQueryMiddleWare};