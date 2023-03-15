const Joi = require("joi");

class Contact {
    constructor( name, email, phone ) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.phone = phone;
    }
  }

const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required()
});

module.exports = {schema};