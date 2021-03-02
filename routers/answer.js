const express=require("express");
const {getAccessToRoute,getAnswerOwnerAccess}=require("../middlewares/autharization/auth");
const {addNewEnswerToQuestion,getSingleAnswer,getAllAnswers,editAnswer,deleteAnswer,likeAnswer,unlikeAnswer}=require("../controllers/answer");
const {checkAnswerExist}=require("../middlewares/database/databaseErrorHelpers");

const router=express.Router({mergeParams:true});

router.post("/",getAccessToRoute,addNewEnswerToQuestion)

router.get("/",getAllAnswers)

router.get("/:answer_id",checkAnswerExist,getSingleAnswer);
// getanswerOwneracces sadece o kullancı erişebilir
//checkanswerexist böyle bir answer var mı kontrol
// get accesstoroute kullanıcı giriş yapmış kontrolu
router.put("/:answer_id",[checkAnswerExist,getAccessToRoute,getAnswerOwnerAccess],editAnswer)
router.delete("/:answer_id/delete",[checkAnswerExist,getAccessToRoute,getAnswerOwnerAccess],deleteAnswer)
router.get("/:answer_id/like",[checkAnswerExist,getAccessToRoute],likeAnswer)
router.get("/:answer_id/unlike",[checkAnswerExist,getAccessToRoute],unlikeAnswer);
module.exports=router;