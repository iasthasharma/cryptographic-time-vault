const crypto = require("crypto");
const fs = require("fs");

const algorithm = "aes-256-cbc";

// 32-byte key
const secretKey = crypto
  .createHash("sha256")
  .update("your-super-secret-key")
  .digest();

const ivLength = 16;

/*
========================================
Encrypt File
========================================
*/
function encryptFile(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const iv = crypto.randomBytes(ivLength);

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);

    // Save IV at file start
    output.write(iv);

    input.pipe(cipher).pipe(output);

    output.on("finish", resolve);
    output.on("error", reject);
  });
}

/*
========================================
Decrypt File
========================================
*/
function decryptFile(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(inputPath);

    let iv;

    input.once("readable", () => {
      iv = input.read(ivLength);

      const decipher = crypto.createDecipheriv(
        algorithm,
        secretKey,
        iv
      );

      const output = fs.createWriteStream(outputPath);

      input.pipe(decipher).pipe(output);

      output.on("finish", resolve);
      output.on("error", reject);
    });
  });
}

module.exports = { encryptFile, decryptFile };