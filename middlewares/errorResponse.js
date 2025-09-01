import { ErrorHandler } from "../helper/index.js";

export const errorResponse = (err, req, res, next) => {
    console.log(err);
    if(err instanceof ErrorHandler)
    {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
            stack: err.stack
        });
    }
    else
    {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}