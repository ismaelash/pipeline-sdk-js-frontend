const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

const fs = require("fs");
const JavaScriptObfuscator = require("javascript-obfuscator");

const AWS = require("aws-sdk");
AWS.config.update({
  region: argv.region ?? "us-east-1",
  accessKeyId: argv.accessKey,
  secretAccessKey: argv.secretKey,
});
const S3 = new AWS.S3();

function obfuscatorIO(code) {
  var obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
    optionsPreset: "low-obfuscation",
  });
  return obfuscationResult.getObfuscatedCode();
}

function uploadFileToS3(content, bucketName, directoryWithFilenameAndExtesion) {
  const params = {
    ACL: "public-read",
    Body: obfuscatorIO(content),
    ContentType: "text/javascript",
    Bucket: bucketName,
    Key: `${directoryWithFilenameAndExtesion}`,
  };

  S3.putObject(params, (err, data) => {
    if (err) {
      throw new Error(err);
    } else {
      console.log(`uploadFileToS3(${params.Key}) on bucket(${params.Bucket})`);
    }
  });
}

uploadFileToS3("Ismael Ash", "pipeline-sdk", "content.js");
