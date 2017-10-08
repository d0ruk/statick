import path from "path"
import mime from "mime-types"
import { S3 } from "aws-sdk"
import { readFile } from "misc"

const s3 = new S3();
export const createBucket = Bucket => s3.createBucket({Bucket}).promise();
export const listBucket = Bucket => s3.listObjects({Bucket}).promise();
export const deleteBucket = Bucket => s3.deleteBucket({Bucket}).promise();
export const headBucket = Bucket => s3.headBucket({Bucket}).promise();
export const deleteObject = (Bucket, Key) => {
  return s3.deleteObject({Bucket, Key}).promise();
};

export function putBucketWebsite(Bucket, index="index.html", error=index) {
  return s3.putBucketWebsite({
    Bucket,
    WebsiteConfiguration: {
      ErrorDocument: {
        Key: error
      },
      IndexDocument: {
        Suffix: index
      }
    }
  }).promise();
}

export async function getBucketUrl(Bucket) {
  const {
    LocationConstraint: region
  } = await s3.getBucketLocation({Bucket}).promise();
  // figure out which separator (. or -) to use
  const sep = s3.endpoint.href.match(/\/\/s3(\.|-)/)[1];

  if (region === "") {
    return `http://${Bucket}.s3-website-us-east-1.amazonaws.com`;
  } else {
    return `http://${Bucket}.s3-website${sep}${region}.amazonaws.com`;
  }
}

export async function putFile(Bucket, outputFolder, filePath) {
  const Key = filePath.replace(outputFolder + path.sep, "");
  const Body = await readFile(filePath);
  const ContentType = mime.lookup(path.extname(filePath));

  return s3.putObject({
    Bucket,
    Key,
    ContentType,
    Body,
    ACL: "public-read"
  }).promise();
}
