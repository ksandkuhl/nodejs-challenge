"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const crypto_1 = require("crypto");
const zlib_1 = require("zlib");
const path = require("path");
const stream_1 = require("stream");
class SentencesSumsChunkwise extends stream_1.Transform {
    constructor() {
        super({ readableObjectMode: true, writableObjectMode: true });
    }
    _transform(chunk, encoding, next) {
        const sentences = chunk.toString("utf8").split(".");
        const sums = sentences
            .map((s) => s
            .split("")
            .map((i) => parseInt(i))
            .filter((i) => !isNaN(i))
            .reduce((acc, current) => (acc += current), 0))
            .filter((sum) => sum > 0);
        return sums.length ? next(null, sums) : next();
    }
}
class ProcessSums extends stream_1.Transform {
    constructor() {
        super({ readableObjectMode: true, writableObjectMode: true });
        this.lastNumber = 0;
    }
    _transform(sums, encoding, next) {
        const currentSums = sums.slice(0, sums.length - 1);
        currentSums[0] += this.lastNumber;
        currentSums.forEach((num) => this.push(num));
        this.lastNumber = sums[sums.length - 1];
        next();
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
const sentencesSumsChunkwise = new SentencesSumsChunkwise();
const processSums = new ProcessSums();
const task4a = async () => {
    const sums = [];
    return new Promise((resolve) => {
        task1()
            .pipe(sentencesSumsChunkwise)
            .pipe(processSums)
            .on("data", (num) => sums.push(num))
            .on("end", () => resolve(sums
            .map((val, index) => [val, index])
            .sort((a, b) => b[0] - a[0])
            .slice(0, 10)
            .sort((a, b) => a[1] - b[1])
            .map(([val, _originalIndex]) => val)
            .map((val, index) => val - index)));
    });
};
// the word is:
// nodejs@red
const task4b = () => task4a()
    .then((sums) => {
    console.log("sums", sums);
    return sums;
})
    .then((sums) => sums.map((sum) => String.fromCharCode(sum)).join(""))
    .then((word) => {
    console.log("the word is:", word);
    return word;
});
task4b();
