"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const crypto_1 = require("crypto");
const zlib_1 = require("zlib");
const path = require("path");
const stream_1 = require("stream");
const readline = require("readline");
class DevideSentences extends stream_1.Transform {
    constructor() {
        super({ readableObjectMode: true, writableObjectMode: true });
    }
    _transform(chunk, encoding, next) {
        return next(null, chunk.toString("utf8").replace(/\./g, "\r\n"));
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
const devideSentences = new DevideSentences();
const task4a = async () => {
    var e_1, _a;
    const sums = [];
    const input = task1().pipe(devideSentences);
    const rl = readline.createInterface({ input, crlfDelay: Infinity });
    try {
        for (var rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = await rl_1.next(), !rl_1_1.done;) {
            const line = rl_1_1.value;
            const sum = line
                .split("")
                .map((i) => parseInt(i))
                .filter((i) => !isNaN(i))
                .reduce((acc, current) => (acc += current), 0);
            sums.push(sum);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (rl_1_1 && !rl_1_1.done && (_a = rl_1.return)) await _a.call(rl_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    const result = sums
        .map((val, index) => [val, index])
        .sort((a, b) => b[0] - a[0])
        .slice(0, 10)
        .sort((a, b) => a[1] - b[1])
        .map(([val, index]) => val - index);
    console.log("the 10 biggest sums minus their indexes:", result);
    return result;
};
const task4b = () => {
    task4a()
        .then((numbers) => numbers.map((num) => String.fromCharCode(num)).join(""))
        .then((word) => console.log(word));
};
task4b();
