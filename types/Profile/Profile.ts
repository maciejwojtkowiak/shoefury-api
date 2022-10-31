import { IAuthUser } from "types/Auth/Auth";

export interface IProfileEdit extends IAuthUser {
  name: string;
}
