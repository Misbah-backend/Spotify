const { ImageKit } = require('@imagekit/nodejs');
const fs = require('fs');
const path = require('path');

function hasImageKitConfig() {
    const pubKey = process.env.IMAGEKIT_PUBLIC_KEY?.trim();
    const privKey = process.env.IMAGEKIT_PRIVATE_KEY?.trim();
    const urlEnd = process.env.IMAGEKIT_URL_ENDPOINT?.trim();
    return pubKey && privKey && urlEnd;
}

function createImageKitClient() {
    return new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY?.trim(),
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY?.trim(),
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT?.trim(),
    });
}

async function uploadFile(file) {
    // Expecting `file` to be the multer file object (with buffer and originalname).
    if (!file || !file.buffer) throw new Error('Invalid file passed to uploadFile');

    if (hasImageKitConfig()) {
        const imagekit = createImageKitClient();
        const base64 = file.buffer.toString('base64');
        const result = await imagekit.files.upload({
            file: base64,
            fileName: file.originalname || 'music_' + Date.now(),
            folder: 'yt-complete/music',
        });
        return result;
    }

    // Fallback: save file locally into ./uploads
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const safeName = file.originalname || `music_${Date.now()}`;
    const outputName = `${Date.now()}_${safeName}`.replace(/[^a-zA-Z0-9._-]/g, '_');
    const outputPath = path.join(uploadsDir, outputName);

    await fs.promises.writeFile(outputPath, file.buffer);

    return {
        url: `/uploads/${outputName}`,
        filePath: outputPath,
        name: outputName,
    };
}

module.exports = {
    uploadFile,
};
