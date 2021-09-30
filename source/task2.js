"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const task1_1 = require("./task1");
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
const sumIntegersChunkwise = new SumIntegersChunkwise();
// the sum is 10765
const task2 = () => {
    let totalSum = 0;
    (0, task1_1.task1)()
        .pipe(sumIntegersChunkwise)
        .on("data", (data) => (totalSum += data))
        .on("finish", () => console.log("the sum is:", totalSum));
};
task2();
