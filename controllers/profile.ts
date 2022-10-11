import { Response, Request, NextFunction } from "express";
import { IAuthUser } from "../types/User";
import { createError } from "../utils/createError";
import { getUser } from "../utils/user/getUser";

export const getProfile = async (req: Request<{}, {}, IAuthUser>, res: Response, next: NextFunction) => {
    const currentUser = await getUser(req.body.userId);
    console.log("USER", currentUser)
    if (currentUser) {
        res.status(200).json({ name: currentUser.name, profileImage: currentUser.profileImage, orders: currentUser.orders  })
    }
    if (!currentUser) next(createError("No user found", 500))
    
}