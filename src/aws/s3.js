import { sep, extname } from "path"
import mime from "mime-types"
import { S3 } from "aws-sdk"
import { readFile } from "misc"

const s3 = new S3();
export const createBucket = Bucket => s3.createBucket({Bucket}).promise();
export const deleteBucket = Bucket => s3.deleteBucket({Bucket}).promise();
export const headBucket = Bucket => s3.headBucket({Bucket}).promise();
export const deleteObject = (Bucket, Key) => {
  return s3.deleteObject({Bucket, Key}).promise();
};

export async function listBucket(Bucket) {
  let ContinuationToken, isTruncated;

  const Contents = [];

  do {
    const data = await s3.listObjectsV2({
      Bucket,
      ContinuationToken,
    }).promise();
    Contents.push(...data.Contents);
    isTruncated = data.IsTruncated;

    ContinuationToken = isTruncated
      ? data.NextContinuationToken
      : null;
  } while (isTruncated);

  return Contents;
}

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
  const separator = s3.endpoint.href.match(/\/\/s3(\.|-)/)[1];

  if (region === "") {
    return `http://${Bucket}.s3-website-us-east-1.amazonaws.com`;
  } else {
    return `http://${Bucket}.s3-website${separator}${region}.amazonaws.com`;
  }
}

export async function putFile(Bucket, outputFolder, filePath) {
  const Key = filePath.replace(outputFolder + sep, "");
  const Body = await readFile(filePath);
  const ContentType = mime.lookup(extname(filePath));

  return s3.putObject({
    Bucket,
    Key,
    ContentType,
    Body,
    ACL: "public-read"
  }).promise();
}
