import { Transform, TransformCallback } from "stream";
import { task1 } from "./task1";

const vocalMap = { a: 2, e: 4, i: 8, o: 16, u: 32 };
class SumIntegersAndVocalsChunkwise extends Transform {
  constructor() {
    super({ readableObjectMode: true, writableObjectMode: true });
  }

  _transform(chunk: Buffer, encoding: string, next: TransformCallback) {
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
  task1()
    .pipe(sumIntegersAndVocalsChunkwise)
    .on("data", (data) => (totalSum += data))
    .on("finish", () => console.log("the sum with vocals is:", totalSum));
};

task3();
