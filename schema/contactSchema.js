const Joi = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const contacts = new Schema(
    {
        name: {
          type: String,
          required: [true, 'Set name for contact'],
        },
        email: {
          type: String,
        },
        phone: {
          type: String,
        },
        favorite: {
          type: Boolean,
          default: false,
        },
        owner: {
          type: Schema.Types.ObjectId,
          ref: 'user',
        }
    }
);

const Contact = mongoose.model("contact", contacts);



const schemaValidation = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean().required(),
});

module.exports = {Contact, contactSchema: schemaValidation};
