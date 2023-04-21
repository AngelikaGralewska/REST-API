const gravatar = require("gravatar");
const { v4: uuidv4 } = require("uuid");

const{
    User,
    hashPassword
} = require("../schema/userSchema");



const createUser = async (email, password) => {
    const avatarURL = gravatar.url(email)
    const hashedPassword = hashPassword(password);
    const verificationToken = uuidv4();
    const user = new User ({ email, password: hashedPassword, avatarURL, verificationToken });
    user.save();
    return user;
};

const getUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    return user;
};

const getUserById = async (_id) => {
    const user = await User.findOne({ _id });
    return user;
};

const updateToken = async (id, token) => {
    const user = await User.findByIdAndUpdate(id, { token }, { new: true });
    return user;
};

const getUserByToken = async (verificationToken) => {
    const user = await User.findOne({ verificationToken });
    return user;
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    updateToken,
    getUserByToken
};