export const otpTemplate = (otp) => {
    return `
    <h1>OTP Verification</h1>
    <p>Your OTP for verification is ${otp}</p>
    <p>This OTP will expire in 10 minutes</p>
    <p>If you did not request this OTP, please ignore this email</p>
    `;
}

export const resetPasswordTemplate = (token) => {
    return `
    <h1>Reset Password</h1>
    <p>Click the link below to reset your password</p>
    <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}">Reset Password</a>
    <p>If you did not request this reset, please ignore this email</p>
    `;
}

export const newUserTemplate = (name) => {
    return `
    <h1>Welcome to Virtual Gallery</h1>
    <p>Welcome ${name} to Virtual Gallery</p>
    <p>Thank you for signing up</p>
    <p>If you have any questions, please contact us</p>
    `;
}