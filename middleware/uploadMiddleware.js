import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 },
})

export const uploadImageBuffer = (buffer, options) => {
    if (!buffer || !buffer.length) {
        return Promise.reject(new Error("Image buffer is required"));
    }

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "chat-app/avatars",
                resource_type: "image",
                transformation: [
                    { width: 200, height: 200, crop: "fill" },
                    { quality: "auto" }
                ],
                ...options
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(result);
            }
        );

        uploadStream.end(buffer);
    });
};
