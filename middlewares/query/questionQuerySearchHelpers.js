const searchHelper=(serachKey,query,req)=>{
    if(req.query.search){
        const serachObject={};
        const regex=new RegExp(req.query.search,"i");
        serachObject[serachKey]=regex;
        return query.where(serachObject);
    }
    return query;
}
const populateHelper=(query,populateValues)=>{
    return query.populate(populateValues);
}
const questionSortHelper=(req,query)=>{
    const sortKey=req.query.sortBy;
    if(sortKey==="most-answerd"){
       return query.sort("-answercount -createAt")// yanındaki parametre answercountun diğerleryle aynı olmasılığı yüzüden bu sefer de create ile veriliyor
    }
    if(sortKey==="most-liked"){
        return query.sort("-likecount -createAt");
    }  
    return  query.sort("-createAt")
    
}
const paginationHelper=async(query,req,model)=>{
    const page=parseInt(req.query.page)||1;
    const limit=parseInt(req.query.limit)||5;

    const startIndex=(page-1)*limit;
    const endIndex=page*limit;

    const tolatQuestion=await model.countDocuments();
    const pagination={};
    if(startIndex>0){
        pagination.previous={
            page:page-1,
            limit:limit
        }
    }
    if(endIndex<tolatQuestion){
        pagination.next={
            page:page+1,
            limit:limit
        }
    }   
    return {query:query.skip(startIndex).limit(limit),pagination:pagination};
}
module.exports={searchHelper,paginationHelper,populateHelper,questionSortHelper};