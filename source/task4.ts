import { createReadStream, readFileSync } from "fs";
import { createDecipheriv } from "crypto";
import { createUnzip } from "zlib";
import * as path from "path";
import { Transform, TransformCallback } from "stream";
import * as readline from "readline";
class DevideSentences extends Transform {
  constructor() {
    super({ readableObjectMode: true, writableObjectMode: true });
  }

  _transform(chunk: Buffer, encoding: string, next: TransformCallback) {
    return next(null, chunk.toString("utf8").replace(/\./g, "\r\n"));
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

const devideSentences = new DevideSentences();

const task4a = async () => {
  const sums: number[] = [];
  const input = task1().pipe(devideSentences);
  const rl = readline.createInterface({ input, crlfDelay: Infinity });

  for await (const line of rl) {
    const sum = line
      .split("")
      .map((i) => parseInt(i))
      .filter((i) => !isNaN(i))
      .reduce((acc, current) => (acc += current), 0);
    sums.push(sum);
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
