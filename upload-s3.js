const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

const fs = require("fs");
const AWS = require("aws-sdk");
const JavaScriptObfuscator = require("javascript-obfuscator");
AWS.config.update({
  region: "us-east-1",
  accessKeyId: argv.accessKey, // via terminal
  secretAccessKey: argv.secretKey, // via terminal
});
const S3 = new AWS.S3();

function obfuscatorIO(code) {
  var obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
    optionsPreset: "medium-obfuscation",
    log: true,
  });
  return obfuscationResult.getObfuscatedCode();
}

function uploadFileToS3(code, bucketName, fileNameWithExtesion) {
  const params = {
    ACL: "public-read",
    Body: obfuscatorIO(code),
    ContentType: "text/javascript",
    Bucket: bucketName,
    Key: `${fileNameWithExtesion}`,
  };
  // console.log("uploadFileToS3.params", params);

  S3.putObject(params, (err, data) => {
    if (err) {
      throw new Error(err);
    } else {
      console.log(`uploadFileToS3(${params.Key}) on bucket(${params.Bucket})`);
    }
  });
}

uploadFileToS3('Ismael', 'pipeline-sdk', 'github-actions.js')