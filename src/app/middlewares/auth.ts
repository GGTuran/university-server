import httpStatus from "http-status";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync"
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from "../config";
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(async (req, res, next) => {
        const token = req.headers.authorization;

        //checking if the token is given
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
        }

        //checking if the token is valid
        let decoded;
        try {
            decoded = jwt.verify(token, config.JWT_ACCESS_SECRET as string) as JwtPayload;
        } catch (error) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!!')
        }
         
        // const role = decoded.role;
        const { role, userId, iat } = decoded;
        const user = await User.isUserExistsByCustomId(userId);
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'User not found');
        }

        //checking if the user is deleted
        const isDeleted = user?.isDeleted;
        if (isDeleted) {
            throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
        }

        //checking if the user is blocked 
        const isBlocked = user?.status;
        if (isBlocked === 'blocked') {
            throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
        }
        //with static method
        // if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
        //     throw new AppError(httpStatus.FORBIDDEN, 'Passwords are not matching');
        // }

        if(user.passwordChangedAt && User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt,iat as number)){
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
        }

        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
        }



        req.user = decoded as JwtPayload

        next();
    })
};

export default auth;