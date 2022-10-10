import User from "../../models/user"

export const getUser = async (id: string) => {
    return await User.findOne({_id: id})
}