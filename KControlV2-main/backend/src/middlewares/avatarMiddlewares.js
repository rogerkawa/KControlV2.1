import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import fs from "node:fs";

const uploadDir = path.resolve("uploads/avatars");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadDir);
    },

    filename: (req, file, callback) => {
        const extensao = path.extname(file.originalname).toLowerCase();
        const nomeArquivo = `${crypto.randomUUID()}${extensao}`;

        callback(null, nomeArquivo);
    }
});

const fileFilter = (req, file, callback) => {
    const tiposPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (!tiposPermitidos.includes(file.mimetype)) {
        return callback(new Error("Formato de imagem não permitido."));
    }

    callback(null, true);
};

const uploadAvatar = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

export default uploadAvatar;