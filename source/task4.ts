import { Transform, TransformCallback } from "stream";
import { task1 } from "./task1";

class SentencesSumsChunkwise extends Transform {
  constructor() {
    super({ readableObjectMode: true, writableObjectMode: true });
  }
  _transform(chunk: Buffer, encoding: string, next: TransformCallback) {
    const sentences = chunk.toString("utf8").split(".");
    const sums = sentences
      .map((s) =>
        s
          .split("")
          .map((i) => parseInt(i))
          .filter((i) => !isNaN(i))
          .reduce((acc, current) => (acc += current), 0)
      )
      .filter((sum) => sum > 0);
    return sums.length ? next(null, sums) : next();
  }
}
class ProcessSums extends Transform {
  constructor() {
    super({ readableObjectMode: true, writableObjectMode: true });
  }
  lastNumber = 0;
  _transform(sums: number[], encoding: string, next: TransformCallback) {
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
const task4a = async (): Promise<number[]> => {
  const sums: number[] = [];
  return new Promise((resolve) => {
    task1()
      .pipe(sentencesSumsChunkwise)
      .pipe(processSums)
      .on("data", (num: number) => sums.push(num))
      .on("end", () =>
        resolve(
          sums
            .map((val, index) => [val, index])
            .sort((a, b) => b[0] - a[0])
            .slice(0, 10)
            .sort((a, b) => a[1] - b[1])
            .map(([val, _originalIndex]) => val)
            .map((val, index) => val - index)
        )
      );
  });
};

// the word is:
// nodejs@red
export const task4b = () =>
  task4a()
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
