import User, { IUser } from "../../models/user";

export const getUser = async (id: string): Promise<IUser | null> => {
  const user = await User.findOne({ _id: id });
  if (user != null) {
    return user;
  }
  return null;
};
