module.exports = {
  DistributionConfig: {
    CallerReference: 'STRING_VALUE', /* required */
    Comment: 'STRING_VALUE', /* required */
    DefaultCacheBehavior: {
      ForwardedValues: {
        Cookies: {
          Forward: "none",
          WhitelistedNames: { Quantity: 0 }
        },
        QueryString: false,
        Headers: { Quantity: 0 },
        QueryStringCacheKeys: { Quantity: 0 }
      },
      MinTTL: 0,
      TargetOriginId: 'STRING_VALUE', /* required */
      TrustedSigners: {
        Enabled: false,
        Quantity: 0,
      },
      ViewerProtocolPolicy: "allow-all", //| https-only | redirect-to-https, /* required */
      AllowedMethods: {
        Items: ["GET", "HEAD"],
        // Quantity: 0, /* required */
      },
      Compress: true,
      DefaultTTL: 86400,
      MaxTTL: 31536000,
    },
    Enabled: true,
    Origins: {
      // Quantity: 0, /* required */
      Items: [
        {
          DomainName: 'STRING_VALUE', /* required */
          Id: 'STRING_VALUE', /* required */
          CustomHeaders: {
            Quantity: 0, /* required */
            Items: [
              {
                HeaderName: 'STRING_VALUE', /* required */
                HeaderValue: 'STRING_VALUE' /* required */
              },
              /* more items */
            ]
          },
          CustomOriginConfig: {
            HTTPPort: 80, /* required */
            // HTTPSPort: 0, /* required */
            OriginProtocolPolicy: "match-viewer", //http-only |  | https-only, /* required */
            OriginKeepaliveTimeout: 0,
            OriginReadTimeout: 0,
            OriginSslProtocols: {
              Items: [ /* required */
                //SSLv3 | TLSv1 | TLSv1.1 | TLSv1.2,
                /* more items */
              ],
              Quantity: 0 /* required */
            }
          },
          OriginPath: 'STRING_VALUE',
          S3OriginConfig: {
            OriginAccessIdentity: 'STRING_VALUE' /* required */
          }
        },
        /* more items */
      ]
    },
    Aliases: {
      Quantity: 0, /* required */
      Items: [
        'STRING_VALUE',
        /* more items */
      ]
    },
    DefaultRootObject: 'STRING_VALUE',
    HttpVersion: "http2",
    PriceClass: "PriceClass_100" // | PriceClass_200 | PriceClass_All
  }
}
