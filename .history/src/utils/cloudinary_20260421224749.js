import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process,
    api_secret:'BdZ4WxsRYyoUOVCMgbgKf6XR26g'
});