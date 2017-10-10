const statick = require("../../dist/statick.js").default;

const config = {
  provider: "aws",
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
