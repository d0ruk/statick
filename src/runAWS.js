import { red, green, blue, white, bold } from "chalk" // eslint-disable-line
import ora from "ora"

import { putBucketWebsite, getBucketUrl } from "./aws/s3"
// import { listDistributions } from "./aws/cf.js"
// import { listHostedZones } from "./aws/r53.js"
import uploadToBucket from "./tasks/upload-to-bucket.js"
import { hasIndexPage } from "./misc"

export async function runAWS(opts, PATH) {
  if (!opts.aws) throw new Error("No AWS key config");

  const {
    exclude,
    domain: Bucket,
    aws: { s3: { IndexDocument, ErrorDocument }}
  } = opts;

  const spinner = ora({ spinner: "moon" }).start();
  spinner.stopAndPersist({
    text: green.bold("Provider: AWS"),
    symbol: blue.bold("\u00BB")
  }).start();

  try {
    await hasIndexPage(PATH, IndexDocument);

    // const { Items } = await listDistributions();
    // console.dir(Items, { depth: 1 })
    // const { HostedZones } = await listHostedZones();
    // return HostedZones;

    spinner.text = `Uploading ${bold(PATH)} to ${bold(Bucket)}`;
    await uploadToBucket(PATH, Bucket, exclude);
    // spinner.render({
    //   text: `Uploaded to ${Bucket}`,
    //   symbol: blue.bold("\u25BA")
    // });

    spinner.text = `Configuring bucket ${bold(Bucket)} for static website`;
    await putBucketWebsite(Bucket, IndexDocument, ErrorDocument);
    // await new Promise(res => setTimeout(res, 3000))
    spinner.succeed(`S3 bucket ${bold(Bucket)}`);

    return await getBucketUrl(Bucket);
  } catch(err) {
    spinner.stop();
    throw err;
  }
}
