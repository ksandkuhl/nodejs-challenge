"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.task1 = void 0;
const fs_1 = require("fs");
const crypto_1 = require("crypto");
const zlib_1 = require("zlib");
const path = require("path");
console.log("Here we go!");
const task1 = () => {
    const unzip = (0, zlib_1.createUnzip)();
    const ivPath = path.join(__dirname, "../iv.txt");
    const secretPath = path.join(__dirname, "../secret.enc");
    const keyPath = path.join(__dirname, "../secret.key");
    const authPath = path.join(__dirname, "../auth.txt");
    const key = (0, fs_1.readFileSync)(keyPath, "utf8").substr(0, 32);
    const iv = (0, fs_1.readFileSync)(ivPath);
    const authTag = (0, fs_1.readFileSync)(authPath);
    const readStream = (0, fs_1.createReadStream)(secretPath);
    const decrypt = (0, crypto_1.createDecipheriv)("aes-256-gcm", key, iv);
    decrypt.setAuthTag(authTag);
    return readStream.pipe(decrypt).pipe(unzip);
};
exports.task1 = task1;
const writeTask1ToDisk = () => {
    const reveiledPath = path.join(__dirname, "../secret.dec");
    const writeStream = (0, fs_1.createWriteStream)(reveiledPath);
    (0, exports.task1)()
        .pipe(writeStream)
        .on("finish", () => console.log("finished writing"));
};
writeTask1ToDisk();
