import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECERT
});

const uploadoncloudinary = async (localfilepath) => {
    try{
        if(!localfilepath) return null;
        
    }catch(error){

    }

}
//Multer = “Gatekeeper” (takes file from user)
//Cloudinary = “Warehouse” (stores file safely in cloud)