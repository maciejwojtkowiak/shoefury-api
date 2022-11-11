import { CustomError } from "../types/Error/Error";

export const createError = (message: string, status?: number): CustomError => {
  const error = new Error(message) as CustomError;
  error.status = status ?? undefined;
  return error;
};
