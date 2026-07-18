const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';


// PRE SIGNED URL GENERATE KREGA YE FUNCTION
const getUploadUrl = async (fileName, contentType, token) => {
    const response = await fetch(`${API_BASE}/invoices/upload-url`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fileName, contentType }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to get upload URL');
    }

    return data.data;
};



// YE FUNCTION USS PRE SIGNED URL KE DWARA S3 ME DIRECT INVOICE UPLOAD KRDEGA
const uploadFileToS3 = async (uploadUrl, file, contentType) => {
    const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': contentType,
        },
        body: file,
    });

    if (!response.ok) {
        throw new Error('File upload to S3 failed (URL may have expired or content-type mismatch)');
    }

    return true;
};



const uploadInvoiceFile = async (file, token) => {
    const { uploadUrl, key, contentType } = await getUploadUrl(file.name, file.type, token);
    await uploadFileToS3(uploadUrl, file, contentType);

    return {
        s3Key: key,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
    };
};

export { getUploadUrl, uploadFileToS3, uploadInvoiceFile };