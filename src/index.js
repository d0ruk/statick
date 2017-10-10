import { red, green, blue, white, bold } from "chalk" // eslint-disable-line
import http from "http"
import https from "https"
import { resolve } from "path"

import AWS from "aws-sdk"
import ora from "ora"
import d from "debug"
const debug = d("statick");

import { isDir } from "./misc"
http.globalAgent.maxSockets = https.globalAgent.maxSockets = 50;

export default async function statick(options) {
  debug(options);
  const  { provider, path, domain, aws } = options;

  // TODO: await validateOptions()
  if (!path) throw "statick | Missing path in config";

  const spinner = ora({ spinner: "moon" });
  const PATH = resolve(path);
  await isDir(resolve(PATH));

  switch(String(provider).toLowerCase()) {
  case "aws":
    AWS.config = new AWS.Config({
      apiVersions: {
        s3: "2006-03-01",
        route53: "2014-05-15",
        cloudfront: "2017-03-25"
      },
      region: aws && aws.region || "us-east-1",
      credentials: aws.credentials
    });

    return import(/* webpackChunkName: "runAWS" */ "./runAWS.js")
      .then(({ runAWS }) => runAWS(options, PATH))
      .then(str => spinner.succeed(`Hosted at ${bold(str)}`))
      .catch(err => {
        spinner.fail(err);
        err.stack && console.log(err.stack); // eslint-disable-line
      })
  default:
    throw `statick | Invalid provider key in config ${provider ? `| ${provider}` : ""}`;
  }
}
