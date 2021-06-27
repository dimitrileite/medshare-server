const Joi = require('joi');

// Register Validation
const loginValidation = (data) => {
    const loginSchema = Joi.object({        
        phone: Joi.string(),
        email: Joi.string().min(6).email(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,30}$'))
            .required()
    }).xor('phone','email');
    return loginSchema.validate(data);
};

module.exports.loginValidation = loginValidation;