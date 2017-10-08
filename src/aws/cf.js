import CloudFront from "aws-sdk/clients/cloudfront"

const CF = new CloudFront();

export const listDistributions = Marker => (
  CF.listDistributions({Marker}).promise()
);

export const createDistribution = params => (
  CF.createDistribution(params).promise()
);
