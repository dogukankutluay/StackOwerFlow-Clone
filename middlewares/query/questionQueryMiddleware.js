const asyncHandler=require("express-async-handler");
const {searchHelper,questionSortHelper,populateHelper,paginationHelper} = require("./questionQuerySearchHelpers");
const questionQueryMiddleware=function (model,options) {
    return asyncHandler(async function(req,res,next){
        let query=model.find();
        query=searchHelper("title",query,req);
        if(options&&options.population){
            query=populateHelper(query,options.population);
        }
        query=questionSortHelper(req,query);
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

module.exports={questionQueryMiddleware};