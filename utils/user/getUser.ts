import User, { IUser } from "../../models/user"
import { createError } from "../createError";

export const getUser = async (id: string): Promise<IUser | null> => {
    const user = await User.findOne({_id: id});
    if (user) {
        return user;
    }
    return null
 
}