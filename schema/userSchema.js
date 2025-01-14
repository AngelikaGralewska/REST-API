const Joi = require("joi");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const users = new Schema(
    {
        password: {
          type: String,
          required: [true, 'Password is required'],
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true,
        },
        subscription: {
          type: String,
          enum: ["starter", "pro", "business"],
          default: "starter"
        },
        token: {
          type: String,
          default: null,
        },
        avatarURL: {
          type: String,
        },
        verify: {
          type: Boolean,
          default: false,
        },
        verificationToken: {
          type: String,
        },
      }
);

const hashPassword = (pass) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(pass, salt);
    return hashedPassword;
  };

const User = mongoose.model("user", users);


const schemaValidation = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required().min(5),
});

const schemaValidationVerify = Joi.object({
  email: Joi.string().required(),
});

module.exports = {User, usersSchema: schemaValidation, verifySchema: schemaValidationVerify, hashPassword};