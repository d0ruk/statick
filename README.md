
### config.yml

```yml
provider: aws
domain: statick.io
folder: ./public
exclude:
  - deleteme.html

aws:
  region: eu-west-1
  s3:
    IndexDocument: myIndex.html
```

### options

| key  | description  | default  | type |
|---|---|--:|--:|
| provider* | one of; "aws" | -| string |
| domain* | uploaded-to storage will be named this | -| string |
| path*   | *relative path* of the folder the static app resides in  | - | string |
| aws.region  | *global* region of the AWS clients | "us-east-1" | string |
| aws.\*accessKey\*  | credentials for AWS client |  - | string |
| aws.s3.IndexDocument | entry .html to your bucket (only basename) | "index.html"| string |
| aws.s3.ErrorDocument | .html to redirect to (only basename) | IndexDocument | string |
| exclude | regular expressions to filter filenames with  |   -| array |

\* required

#### Notes

- Constraints on S3 bucket name

  - The bucket name must be between 3 and 63 characters long (inclusive).
  - The bucket name must contain only lowercase characters, numbers, periods, underscores, and dashes. periods, underscores, and dashes.
  - The bucket name must not contain adjacent periods.

- *Conflicting conditional operation in progress* error indicates the S3 bucket name is currently unavailable. Trying again in a couple minutes works.

#### Reading

* [Managing Access Keys for Your AWS Account](http://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html)

* [Best Practices for Managing AWS Access Keys](http://docs.aws.amazon.com/general/latest/gr/aws-access-keys-best-practices.html)

* [Domains That You Can Register with Route 53](http://docs.aws.amazon.com/Route53/latest/DeveloperGuide/registrar-tld-list.html)

* [Using CloudFront with Amazon S3](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/MigrateS3ToCloudFront.html)
