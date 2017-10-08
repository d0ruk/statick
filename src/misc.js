import { sep } from "path"
import fs from "fs"
import { promisify } from "bluebird"

export const readFile = path => (promisify(fs.readFile))(path)
export const stat = path => (promisify(fs.stat))(path)

export async function hasIndexPage(folderPath, IndexDocument) {
  const path = `${folderPath}${sep}${IndexDocument}`;

  try {
    await stat(path);
    return true;
  } catch(err) {
    throw err;
  }
}

export async function isDir(path) {
  return await stat(path).then(s => s.isDirectory());
}
