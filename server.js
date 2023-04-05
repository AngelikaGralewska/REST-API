const app = require('./app')
//const createFolderIfNotExist = require("./file/folderCheck")

app.listen(3000, () => {
  //createFolderIfNotExist(storeImage);
  console.log("Server running. Use our API on port: 3000")
})
