const answer=require("./answer");
const express=require("express");
const Question=require("../models/Questions");
const {questionQueryMiddleware}=require("../middlewares/query/questionQueryMiddleware"); 
const {checkAskExist}=require("../middlewares/database/databaseErrorHelpers");
const {getAccessToRoute,getQuestionOwnerAccess}=require("../middlewares/autharization/auth");
const {askNewQuestion,getAllAsks,getAskFromId,editQuestion,likeQuestion,deleteQuestion,undoLikeQuestion}=require("../controllers/question");

const router=express.Router();


router.get("/:id",checkAskExist,getAskFromId);
router.get("/",questionQueryMiddleware(Question,{
    population:{
        path:"user",
        select:"role name createdat profile_image"
    }
}),getAllAsks);

router.post("/ask",getAccessToRoute,askNewQuestion);

router.put("/:id/edit",[getAccessToRoute,checkAskExist,getQuestionOwnerAccess],editQuestion);

router.delete("/delete/:id",[getAccessToRoute,checkAskExist,getQuestionOwnerAccess],deleteQuestion);

router.get("/like/:id",[getAccessToRoute,checkAskExist],likeQuestion)
router.get("/undo_like/:id",[getAccessToRoute,checkAskExist],undoLikeQuestion)

router.use("/:question_id/answers",checkAskExist,answer);
module.exports=router;