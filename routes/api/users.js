const express = require('express');
const Joi = require('joi');
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs").promises;
const Jimp = require("jimp");

const {
    getUserByEmail,
    createUser,
    getUserById,
    updateToken,
    getUserByToken
  } = require("../../models/users");
const {loginHandler} = require("../../auth/logIn");
const {auth} = require("../../auth/auth");
const { upload } = require("../../file/pictureFiles");
const {sendEmail} = require("../../email/email")

const {
  usersSchema,
  verifySchema
} = require("../../schema/userSchema");

const {User} = require("../../schema/userSchema")

const avatarsDir = path.join(__dirname, "../../", "public", "avatars")

const router = express.Router();


router.post("/signup", async (req, res, next) => {
 const { error } = usersSchema.validate(req.body);
    if (error) {
     return res.status(400).send(error.details[0].message);
   }
  const email = req.body.email;
  const userSignUp = await getUserByEmail(email);
    if (userSignUp) {
      return res.status(409).send({ message: "Email in use" });
    }
  try {
    const { email, password } = req.body;
    const newUser = await createUser(email, password);
    const msg = {
      to: email,
      subject: 'Verification email',
      text: 'Please verify your email by click link below',
      html: `<p><a target="_blank" href="http://localhost:3000/api/users/verify/${newUser.verificationToken}">verification link</a></p>`,
    };
    await sendEmail(msg);
    return res.status(201).json(newUser);
  } catch {
    return res.status(500).send("Something went wrong");
  }
});
  
router.post("/login", async (req, res, next) => {
  const { error } = usersSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
  const { email, password } = req.body;
    try {
      const token = await loginHandler(email, password);
      return res.status(200).json({ token });
    } catch {
      return res.status(401).send({ message: "Email or password is wrong" });
    }
});
  
router.get("/logout", auth, async (req, res, next) => {
  try {
      const jwtSecret = process.env.JWT_SECRET;
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, jwtSecret);
      const id = decoded.id;
      const user = await getUserById(id);
        if (user) {
          const tokenRemove = await updateToken(id, null);
          return res.status(204).json(tokenRemove);
        }
    } catch {
      return res.status(401).send({ message: "Not authorized" });
    }
});
  
router.get("/current", auth, async (req, res, next) => {
  try {
      const jwtSecret = process.env.JWT_SECRET;
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, jwtSecret);
      const id = decoded.id;
      const user = await getUserById(id);
        if (user && user.token === token) {
          return res.status(200).json(user);
        }
  } catch {
      return res.status(401).send({ message: "Not authorized" });
  }
});

router.patch("/avatars", auth, upload.single("avatar"), async (req, res, next) => {
    const {path: tmpUpload, originalname} = req.file;

    await Jimp.read(`tmp/${originalname}`)
        .then((avatar) => {
            avatar.resize(250, 250).write(`tmp/${originalname}`);
        })
        .catch((err) => {
            console.error(err);
        });

    const jwtSecret = process.env.JWT_SECRET;
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, jwtSecret);
    const id = decoded.id;
    const imageName = `${id}_${originalname}`
    try { 
        const resultUpload = path.join(avatarsDir, imageName);
        await fs.rename(tmpUpload, resultUpload);
        const avatarURL = path.join("public", "avatars", imageName);
        await User.findByIdAndUpdate(id, {avatarURL});
        return res.json({avatarURL});
  } catch {
    return res.status(401).send({ message: "Not authorized" })
  }
});

router.get("/verify/:verificationToken", async (req, res, next) => {
  const { verificationToken } = req.params;
  try {
    const user = await getUserByToken(verificationToken);
    if (!user) {
      res.status(404).json({message: "User not found"});
    } else {
      user.verificationToken = null;
      user.verify = true;
      user.save();
      res.status(200).send({ message: "Verification successful" });
    }
  } catch {
    return res.status(500).send("Something went wrong");
  }
});

router.post("/verify/", async (req, res, next) => {
  const { error } = verifySchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
  const {email} = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res
        .status(404)
        .send({ message: "Email not found. You have to sign in" });
    }
    if (user && user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    } else {
      const msg = {
        to: email,
        subject: 'Verification email',
        text: 'Please verify your email by click link below',
        html: `<p><a target="_blank" href="http://localhost:3000/api/users/verify/${user.verificationToken}">verification link</a></p>`,
      };
      await sendEmail(msg);
      return res.status(200).send({message: "Verification email sent",});
    }
  } catch {
    return res.status(500).send("Something went wrong");
  }
});

  
  module.exports = router;