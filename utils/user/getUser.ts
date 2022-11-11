import User from "../../models/user";
import { IUser } from "../../types/User/User";

export const getUser = async (id: string): Promise<IUser | null> => {
  const user = await User.findOne({ _id: id });
  return user;
};
