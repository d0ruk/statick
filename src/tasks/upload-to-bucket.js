import { map } from "bluebird"
import readdir from "recursive-readdir"
import { red, green, blue, bold } from "chalk" // eslint-disable-line
// import { promise as spinner } from "ora"
import d from "debug"
const debug = d("statick");

import {
  listBucket,
  deleteObject,
  deleteBucket,
  createBucket,
  putFile,
  headBucket
} from "aws/s3"

async function emptyBucket(name) {
  debug(`Emptying bucket ${name}`);
  const { Contents } = await listBucket(name);

  return map(Contents, ({ Key }) => deleteObject(name, Key));
}

async function bucketExists(name) {
  try {
    await headBucket(name);
    return true;
  } catch(e) {
    if (e.code === "Forbidden") throw e;
    return false;
  }
}

async function getBucket(name) {
  if (await bucketExists(name)) {
    try {
      await deleteBucket(name);
    } catch(e) {
      switch (e.code) {
      case "BucketNotEmpty":
        await emptyBucket(name);
        await deleteBucket(name);
        break;
      default:
        throw (e.message = `S3 bucket ${name} | ${e.message}`, e);
      }
    }
  }

  return createBucket(name);
}

export default function(outputFolder, bucketName, exclude=[]) {
  return getBucket(bucketName)
    .then(() => readdir(outputFolder))
    .then(weedOut.bind(null, exclude))
    .then(files => map(files, filePath => {
      debug(`Uploading ${filePath}`);
      return putFile(bucketName, outputFolder, filePath);
    }));

  function weedOut(arr, files) {
    return files.filter(f => !arr.some(e => RegExp(e).test(f)));
  }
}
