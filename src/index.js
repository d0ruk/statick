const isDev = process.env.NODE_ENV === "development";
import PKG from "../package.json"
import { red, green, blue, white, bold, dim } from "chalk" // eslint-disable-line
import http from "http"
import https from "https"
import { resolve } from "path"

import AWS from "aws-sdk"
import Raven from "raven"
import ora from "ora"
import d from "debug"
const debug = d("statick");

import { isDir } from "./misc"
http.globalAgent.maxSockets = https.globalAgent.maxSockets = 50;

if (isDev) {
  Raven.config("https://af99106e8e3b42f7966ba9926e219d72:4c7c8fbbe1084f7a965cc99b2085b353@sentry.io/228380")
    .install();
}

const statick = async options => {
  debug(options);

  const  { provider, path, domain, aws } = options;

  // TODO: await validateOptions()
  if (!path) throw "Missing path in config";

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
    throw `Invalid provider key in config ${provider ? `| ${provider}` : ""}`;
  }
}

statick.version = PKG.version;

export default isDev ? Raven.context(statick) : statick;
