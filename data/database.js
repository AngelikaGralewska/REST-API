const mongoose = require("mongoose");

const dbpath = process.env.MONGO_SECRET;
 
const connectDatabase = async () => {
  await mongoose
    .connect(dbpath)
    .then(() => console.log("Database connection successful"))
    .catch((err) => { console.log("error to connect db" + err)
        process.exit(1);
    });
};
  
module.exports = { connectDatabase };