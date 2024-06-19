import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
export const sendImageToCloudinary = () =>{
    cloudinary.config({
        cloud_name:config.cloud_name,
        api_key:config.api_key,
        api_secret:config.api_secret,
    });

    cloudinary.uploader
       .upload(
           'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
               public_id: 'shoes',
           },
           function(error, result){
            console.log(result);
           },
       );
    
};

