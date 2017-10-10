import { readFileSync } from "fs"
import { safeLoad } from "js-yaml"
import yargs from "yargs/yargs"

import statick from "./statick.js"

const params = yargs(process.argv)
  .options({
    "config": {
      alias: "c",
      describe: "relative path to config file | either in JSON or YAML",
      demandOption: true
    }
  })
  .coerce("config", arg => {
    const file = readFileSync(arg, "utf8");

    return safeLoad(file, {
      json: true
    })
  })
  .demandOption(["config"])
  .parse();

statick(params.config)
  .catch(console.error) // eslint-disable-line
