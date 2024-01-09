const aws = require("aws-sdk");
require("dotenv").config();

const region = "me-south-1";
const bucketName = "transgo";
const accessKeyId = "AKIAZJN2Q7Y34TGXIDFG";
const secretAccessKey = "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";

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

async function generateUploadURL(id,type) {
  const imageName = `${type}/${id}`;

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 60,
    ContentType: "image/jpeg",
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);

  return uploadURL;
}

module.exports = generateUploadURL