import Joi from "joi";

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    otp: Joi.number().required(),
    password: Joi.string().min(3).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
});

const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(3).required(),
});

export { registerSchema, loginSchema, resetPasswordSchema };
