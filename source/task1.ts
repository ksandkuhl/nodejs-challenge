import { createReadStream, createWriteStream, readFileSync } from "fs";
import { createDecipheriv } from "crypto";
import { createUnzip } from "zlib";
import * as path from "path";

console.log("Here we go!");
const unzip = createUnzip();
export const task1 = () => {
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

const writeTask1ToDisk = () => {
  const reveiledPath = path.join(__dirname, "../secret.dec");
  const writeStream = createWriteStream(reveiledPath);
  task1()
    .pipe(writeStream)
    .on("finish", () => console.log("finished writing"));
};
writeTask1ToDisk();
