const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

const {getUserById}=require("../models/users")

const auth = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("No token provided");
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const id = decoded.id;
    const user = await getUserById(id);
    if (user) {
      req.user = user;
      next();
    } else {
      return res.status(401).send("Not authorized");
    }
    if(!user.verify) {
      res.status(401).json({message: 'Email not verified'})
   }
  } catch {
    return res.status(401).send("Access denied");
  }
};

module.exports = { auth };