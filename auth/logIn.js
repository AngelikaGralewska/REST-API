const bcrypt = require("bcrypt");

const {issueToken} = require("./token");
const {getUserByEmail}=require("../models/users");

const loginHandler = async (email, incomingPassword) => {
    const user = await getUserByEmail(email);
    if (!user) {
      throw { code: 404, msg: "User not found!!!" };
    }

    const result = bcrypt.compareSync(incomingPassword, user.password);
  
    if (result) {
      return issueToken(user);
    } else {
      throw { code: 401, msg: "Invalid credentials" };
    }
  };

  module.exports = { loginHandler };