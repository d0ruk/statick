import { red, green, blue, white, bold } from "chalk" // eslint-disable-line
import ora from "ora"

import { putBucketWebsite, getBucketUrl } from "./aws/s3"
import uploadToBucket from "./tasks/upload-to-bucket.js"

export async function runAWS(opts) {
  const {
    exclude,
    path,
    domain: Bucket,
    aws: { s3: { IndexDocument, ErrorDocument }}
  } = opts;

  const spinner = ora({ spinner: "moon" }).start();
  spinner.stopAndPersist({
    text: green.bold("Provider: AWS"),
    symbol: blue.bold("\u00BB")
  }).start();

  try {
    spinner.text = `Uploading ${bold(path)} to ${bold(Bucket)}`;
    await uploadToBucket(path, Bucket, exclude);

    spinner.text = `Configuring bucket ${bold(Bucket)} for static website`;
    await putBucketWebsite(Bucket, IndexDocument, ErrorDocument);

    spinner.succeed(`S3 bucket ${bold(Bucket)}`);
    return await getBucketUrl(Bucket);
  } catch(err) {
    spinner.stop();
    throw err;
  }
}
