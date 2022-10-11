import { CustomError } from "../types/Error";

export const createError = (message: string, status?: number) => {
    const error = new Error(message) as CustomError;
    error.status = status ? status : undefined
    return error
}