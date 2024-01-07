const aws = require("aws-sdk");
require("dotenv").config();

const region = "me-south-1";
const bucketName = "transgo";
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

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