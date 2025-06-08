export const authMiddleware = (req,res,next) =>{
    const token = req.body?.token;

    const isAuthorized = req.body?.token === "xyz"
    
    if(isAuthorized){
       next()
    } else {
        res.status(401).send("Unaurized request")
    }
}