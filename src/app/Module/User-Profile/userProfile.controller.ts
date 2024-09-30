import { RequestHandler } from "express";

const updateUserProfile:RequestHandler = async(req,res,next)=>{
    try {
        // const result = await 
    } catch (error) {
        next(error)
    }
} 

export const userProfileController  = {
    userProfile: updateUserProfile
} 