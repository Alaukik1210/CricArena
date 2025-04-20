import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
 export interface authRequest extends Request{
    userId?:string;

}

export const authentication =  (req:authRequest,res:Response,next:NextFunction)=>{
    console.log("itis cookieszs",req.cookies);
    const token = req.cookies.token ;
    if(!token){
        res.status(404).json({
            message:"No token found",
            success:false
        })
        
    } 

    const decode = jwt.verify(token,process.env.SECRET_KEY as string )
    if(!decode){
        res.status(401).json({
            message:"something went wrong",
            success: false
        })
        return
    }
    req.userId = (decode as jwt.JwtPayload).userId as string
    console.log(decode);
    next()
}