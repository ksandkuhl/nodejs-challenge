"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const crypto_1 = require("crypto");
const zlib_1 = require("zlib");
const path = require("path");
const stream_1 = require("stream");
class SumIntegersChunkwise extends stream_1.Transform {
    constructor() {
        super({ readableObjectMode: true, writableObjectMode: true });
    }
    _transform(chunk, encoding, next) {
        const arr = chunk
            .toString("utf8")
            .split("")
            .map((i) => parseInt(i))
            .filter((i) => !isNaN(i));
        const sum = arr.reduce((acc, current) => (acc += current), 0);
        return sum === 0 ? next() : next(null, sum);
    }
}
console.log("Here we go!");
const unzip = (0, zlib_1.createUnzip)();
const task1 = () => {
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
const sumIntegersChunkwise = new SumIntegersChunkwise();
// the sum is 10765
const task2 = () => {
    let totalSum = 0;
    task1()
        .pipe(sumIntegersChunkwise)
        .on("data", (data) => (totalSum += data))
        .on("finish", () => console.log("the sum is:", totalSum));
};
task2();
