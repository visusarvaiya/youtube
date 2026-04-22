import multer from "multer";
//Multer = “Gatekeeper” (takes file from user) frontend 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
   
    cb(null, file.originalname)
  }
})

 export con   st upload = multer({ 
    storage,
 })