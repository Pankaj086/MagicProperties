import {v2 as cloudinary} from 'cloudinary';

const connectCloudinary = async () => {
    // configure clodinary storage
    try{
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        console.log('Cloudinary configured successfully');
    }
    catch(err){
        console.error("Cloudinary connection error:", err.message);
        process.exit(1);
    }
}

export default connectCloudinary;