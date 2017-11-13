import PKG from "../package.json"
import { red, green, blue, white, bold, dim } from "chalk" // eslint-disable-line
import http from "http"
import https from "https"
http.globalAgent.maxSockets = https.globalAgent.maxSockets = 50;

import AWS from "aws-sdk"
import ora from "ora"
import d from "debug"
const debug = d("statick");

import { validateOptions } from "./misc"

const statick = async options => {
  debug(options);
  const validatedOpts = await validateOptions(options);

  const { provider, aws={} } = validatedOpts;
  const spinner = ora({ spinner: "moon" });

  switch(String(provider).toLowerCase()) {
  case "aws":
    AWS.config = new AWS.Config({
      apiVersions: {
        s3: "2006-03-01",
        route53: "2014-05-15",
        cloudfront: "2017-03-25"
      },
      region: aws.region || "us-east-1",
      credentials: aws.credentials
    });

    return import(/* webpackChunkName: "runAWS" */ "./runAWS.js")
      .then(({ runAWS }) => runAWS(options))
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
export default statick;
