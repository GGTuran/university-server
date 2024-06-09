import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";

const loginUser = async(payload:TLoginUser)=>{
    //checking if the user exist or not
    const isUserExist = await User.findOne({id:payload?.id});
    if(!isUserExist){
        throw new AppError(httpStatus.NOT_FOUND,'User not found');
    }

}

export const AuthServices = {
    loginUser,
}