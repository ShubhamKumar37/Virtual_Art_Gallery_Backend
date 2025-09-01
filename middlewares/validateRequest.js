import Joi from "joi";
import { ErrorHandler } from "../helper/index.js";

export const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error) {
            next(new ErrorHandler(400, error.details.map(detail => detail.message).join(", ")));
        }
    }
}