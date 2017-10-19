const statick = require("statick").default;

const config = {
  provider: "awsasd",
  domain: "statick.test2",
  path: "../public",
  exclude: ["deleteme", ".log$"],
  aws: {
    region: "eu-central-1",
    s3: {
      IndexDocument: "myIndex.html",
      ErrorDocument: "404.html"
    }
  }
};

console.log(`running statick v${statick.version}`);

statick(config)
  .catch(console.error)
