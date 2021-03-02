class CustomError extends Error{
    constructor(message,status){
        super(message);
        this.status=status;
    }
    email(){
        
    }
}

module.exports=CustomError;