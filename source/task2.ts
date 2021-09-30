import { createReadStream, readFileSync } from "fs";
import { createDecipheriv } from "crypto";
import { createUnzip } from "zlib";
import * as path from "path";
import { Transform, TransformCallback } from "stream";

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
const unzip = createUnzip();
const task1 = () => {
  const ivPath = path.join(__dirname, "../iv.txt");
  const secretPath = path.join(__dirname, "../secret.enc");
  const keyPath = path.join(__dirname, "../secret.key");
  const authPath = path.join(__dirname, "../auth.txt");
  const key = readFileSync(keyPath, "utf8").substr(0, 32);
  const iv = readFileSync(ivPath);
  const authTag = readFileSync(authPath);
  const readStream = createReadStream(secretPath);
  const decrypt = createDecipheriv("aes-256-gcm", key, iv);
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
