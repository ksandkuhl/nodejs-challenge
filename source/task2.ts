import { Transform, TransformCallback } from "stream";
import { task1 } from "./task1";

class SumIntegersChunkwise extends Transform {
  constructor() {
    super({ readableObjectMode: true, writableObjectMode: true });
  }

  _transform(chunk: Buffer, encoding: string, next: TransformCallback) {
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
  task1()
    .pipe(sumIntegersChunkwise)
    .on("data", (data) => (totalSum += data))
    .on("finish", () => console.log("the sum is:", totalSum));
};
task2();
