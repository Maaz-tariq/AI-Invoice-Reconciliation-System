const { PutObjectCommand } = require('@aws-sdk/client-s3'); // This to put data into the bucket
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner'); // This is to get temporary access to the bucket
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');  // Ye delete karta hai bucket se

const { v4: uuidv4 } = require('uuid');

const s3Client = require('../config/s3');
const AppError = require('../utils/AppError');


const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];  // Tell what all invoice types are allowed
const URL_EXPIRY_SECONDS = 300; 

const getFileExtension = (mimeType) => { // Invoice extension deta hai taaki object key me use kar sake
    const map = {
        'application/pdf': 'pdf',
        'image/jpeg': 'jpg',
        'image/png': 'png',
    };
    return map[mimeType];
};

const generateObjectKey = (mimeType) => { // Generate key - Key wo hota hai jis naam se browser pe invoice save hogi

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const extension = getFileExtension(mimeType);

    return `invoices/${year}/${month}/${uuidv4()}.${extension}`;
};

const generateUploadUrl = async ({ fileName, contentType }) => {

    if (!fileName || typeof fileName !== 'string') {
        throw new AppError('fileName is required', 400);
    }

    if (!contentType || !ALLOWED_MIME_TYPES.includes(contentType)) {
        throw new AppError('Invalid or unsupported content type', 400);
    }

    const key = generateObjectKey(contentType);

    const command = new PutObjectCommand({ 
        Bucket: process.env.AWS_BUCKET_NAME, // Bucket name
        Key: key,                            // Key is name that invoice will have in bucket
        ContentType: contentType,            // Actual invoice that we are uploading
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {  // ek temporary Uri jisse bucket ko access kar sakte hai
        expiresIn: URL_EXPIRY_SECONDS,
    });

    return {
        uploadUrl,
        key,
        expiresIn: URL_EXPIRY_SECONDS,
        contentType,
    };
};



const deleteObject = async (key) => {
    const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    });

    await s3Client.send(command);
};

module.exports = { generateUploadUrl, deleteObject, ALLOWED_MIME_TYPES };