const Joi = require('joi');

// Register Validation
const registerValidation = (data) => {
    const registerSchema = Joi.object({        
        address: Joi.string().alphanum().required(),
        firstname: Joi.string().min(2).max(255).required(),
        lastname: Joi.string().min(2).max(255).required(),
        birthdate: Joi.date().required(),
        phone: Joi.string().required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,30}$'))
            .required(),
        publickey: Joi.string(),
        privatekey: Joi.string(),
        balance: Joi.string()
    });
    return registerSchema.validate(data);
};

module.exports.registerValidation = registerValidation;