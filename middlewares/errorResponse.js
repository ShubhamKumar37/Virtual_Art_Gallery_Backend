import { ErrorHandler } from "../helper/index.js";

export const errorResponse = (err, req, res, next) => {
    console.log(err);
    if(err instanceof ErrorHandler)
    {
        console.log("This is the error handler");
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
            stack: err.stack
        });
    }
    else
    {
        console.log("This is the error response");
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            errors: err.message,
            stack: err.stack
        });
    }
}