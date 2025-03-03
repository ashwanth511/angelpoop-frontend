import axios from 'axios';

const PINATA_API_KEY = '4522cfcf53d5531e5be8';
const PINATA_SECRET_KEY = 'f7edbc1ed0c8219981ad7cb195e850a88dec39dc5f91ad14c59d600d740fde9d';
const PINATA_API_URL = 'https://api.pinata.cloud';
const PINATA_GATEWAY = 'https://gateway.pinata.cloud';

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function validateImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
    }

    if (file.size > maxSize) {
        throw new Error('File is too large. Maximum size is 5MB.');
    }

    return true;
}

export async function uploadToIPFS(file: File): Promise<string> {
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('pinataMetadata', JSON.stringify({ name: `token_image_${Date.now()}` }));

            const response = await axios.post(`${PINATA_API_URL}/pinning/pinFileToIPFS`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_KEY
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity
            });

            return `${PINATA_GATEWAY}/ipfs/${response.data.IpfsHash}`;
        } catch (error) {
            attempts++;
            if (attempts === maxAttempts) throw error;
            await delay(1000);
        }
    }
    throw new Error('Upload failed after max attempts');
}
