import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import fs from 'fs';

cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret,
});




export const sendImageToCloudinary = (imageName: string, path: string) => {

return new Promise((resolve, reject) =>{
    if (!path) {
        console.error('Error: Path is undefined');
        return reject(new Error('Path is undefined'));
    }

    console.log('Uploading image:', imageName);
    console.log('Image path:', path);
    cloudinary.uploader
    .upload(
        path,
        { public_id: imageName, },
        function (error, result) {
            if(error){
                reject(error);
            }
            resolve(result);
            //deleting a file asynchronously
            fs.unlink(path, (err) =>{
                if(err){
                    console.log(err);
                } else{
                    console.log('File is deleted');
                }
            })
        },
    );
})

};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(
            Math.random() * 1e9
        );
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
});

export const upload = multer({ storage: storage });