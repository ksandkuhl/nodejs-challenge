"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.task4b = void 0;
const stream_1 = require("stream");
const task1_1 = require("./task1");
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
const sentencesSumsChunkwise = new SentencesSumsChunkwise();
const processSums = new ProcessSums();
// [110, 111, 100, 101, 106, 115, 64, 114, 101, 100]
const task4a = async () => {
    const sums = [];
    return new Promise((resolve) => {
        (0, task1_1.task1)()
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
exports.task4b = task4b;
(0, exports.task4b)();
