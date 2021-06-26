const Joi = require('joi');

// Login Validation
const LoginValidation = (data) => {
    const LoginSchema = Joi.object({               
        phone: Joi.string().required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,30}$'))
            .required()
    });
    return LoginSchema.validate(data);
};

module.exports.LoginValidation = LoginValidation;