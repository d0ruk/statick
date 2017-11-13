import { sep, resolve } from "path"
import fs from "fs"
import { promisify } from "bluebird"

export const readFile = path => (promisify(fs.readFile))(path) // eslint-disable-line
export const stat = path => (promisify(fs.stat))(path) // eslint-disable-line

export async function validateOptions(opts) {
  const { provider, domain, path, aws={} } = opts;
  const { s3: { IndexDocument }={} } = aws;
  const PATH = resolve(path);

  if (typeof path !== "string" || !path) {
    throw `Invalid path field in config | ${path}`;
  }

  if (typeof domain !== "string" || !domain ) {
    throw `Invalid domain field in config | ${domain}`;
  }

  try {
    if (!await isDir(PATH)) {
      throw `${PATH} is not a directory.`;
    }

    switch(String(provider).toLowerCase()) {
    case "aws":
      if (!await hasIndexPage(PATH, IndexDocument)) {
        throw `${IndexDocument} is not a valid IndexDocument`;
      }

      return (Object.assign(opts, {path: PATH}), opts);
    default:
      return opts;
    }
  } catch (err) {
    throw err;
  }
}

async function isDir(path) {
  return await stat(path).then(s => s.isDirectory());
}

async function hasIndexPage(folderPath, IndexDocument) {
  const path = `${folderPath}${sep}${IndexDocument}`;
  let isFile;

  if (typeof IndexDocument !== "string" || !IndexDocument ) {
    return false;
  }

  try {
    isFile = await stat(path).then(s => s.isFile());
  } catch(err) {
    return false;
  }

  if (isFile) {
    return true;
  } else {
    return false;
  }
}
