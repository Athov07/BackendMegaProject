import {v2 as cloudinary} from "cloudinary"
import { response } from "express";
import fs from "fs"


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        //Upload file on cloudinary

        const response = await cloudinary.uploader.upload(localFilePath, {resource_type: "auto"})

        //File uploaded on cloudinary
        // console.log("File uploaded on cloudinary", response.url);
        fs.unlinkSync(localFilePath); //Remove file from local uploads folder
        return response;
    } 
    catch (error) {
        fs.unlinkSync(localFilePath);
        console.log("Error while uploading file on cloudinary", error);
        return null;
    }
}

export {uploadOnCloudinary};