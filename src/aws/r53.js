import Route53 from "aws-sdk/clients/route53"

const R53 = new Route53();

export const listHostedZones = params => R53.listHostedZones(params).promise()
