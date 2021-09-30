"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const task1_1 = require("./task1");
const vocalMap = { a: 2, e: 4, i: 8, o: 16, u: 32 };
class SumIntegersAndVocalsChunkwise extends stream_1.Transform {
    constructor() {
        super({ readableObjectMode: true, writableObjectMode: true });
    }
    _transform(chunk, encoding, next) {
        const arr = chunk
            .toString("utf8")
            .toLowerCase()
            .split("")
            .map((char) => parseInt(char) || vocalMap[char] || NaN)
            .filter((i) => !isNaN(i));
        const sum = arr.reduce((acc, current) => (acc += current), 0);
        return sum === 0 ? next() : next(null, sum);
    }
}
console.log("Here we go!");
const sumIntegersAndVocalsChunkwise = new SumIntegersAndVocalsChunkwise();
/// the sum with vocals is: 25061007149
const task3 = () => {
    let totalSum = 0;
    (0, task1_1.task1)()
        .pipe(sumIntegersAndVocalsChunkwise)
        .on("data", (data) => (totalSum += data))
        .on("finish", () => console.log("the sum with vocals is:", totalSum));
};
task3();
