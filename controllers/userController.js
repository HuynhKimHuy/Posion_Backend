import { OK } from "../core/Success.js"

export const UserController = async (req,res)=>{
    new OK({
        message:"OK",
        statusCode:200,
        metadata: req.user
    }).send(res)
}

