export const validateRequest = (schema) => async (req, res, next) => {
    try{
        const {error} = await schema.validateAsync(req.body);
        if(error) return next(new ErrorHandler(400, error.details[0].message));
        next();
    }
    catch(error){
        return next(new ErrorHandler(500, "Internal Server Error"));
    }
}