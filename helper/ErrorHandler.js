export class ErrorHandler extends Error
{
    constructor(statusCode, message = "Internal Server Error", errors = [], stack = null)
    {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.stack = stack || new Error().stack;

        Error.captureStackTrace(this, this.constructor);
    }
}