# Self-hosted primo

The goal of this project is to make it possible to run primo on your own node server - including everything needed to run the typical CMS like authentication, the ability to invite collaborators, a database for code and content, etc.

The initial strategy was to leverage the filesystem to host the static site & use JSON files as a database, but it turns out that's not possible with Heroku, so instead we'll be using an AWS S3 bucket for all the static assets (and the JSON database, at least for now). This way, the only steps which should be necessary to get the primo server up and running will be:

1. Click 'Deploy to Heroku' button
1. Create user account (w/ email and password)
1. Connect MongoDB
1. Select a hosting provider and enter key

## First Things First

* Primo
  * accessible from `edit` subdomain ✅
* Heroku
  * [Set Config Variables](https://devcenter.heroku.com/articles/platform-api-reference#config-vars)
  * [Deploy Button](https://devcenter.heroku.com/articles/heroku-button)
* Database
  * Set up [MongoDB](https://flaviocopes.com/node-mongodb/) ✅
  * Store Site ✅
  * Store Users ✅
  * Store Config
  * Handle multiple sites
* Functions (PostCSS) ✅
* Static sites
  * Generating ✅
  * Hosting on AWS S3
    * Uploading generated site ✅
    * [Set region](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html)
    * [Configuring S3 bucket as site host](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketWebsite-property) (set permissions & hosting)
* Server-side rendering ✅
* [Email Authentication](http://www.passportjs.org/)
  * Signing in w/ username and password ✅
  * Creating initial account
  * Resetting password
* [Invitation over Email](https://nodemailer.com/transports/sendmail/)
  * Sending invitation
  * Creating collaborator account
* Onboarding
  * Create admin account
  * Connect database
  * Select a host

## After

* [Set domain name](https://docs.aws.amazon.com/AmazonS3/latest/dev/website-hosting-custom-domain-walkthrough.html#website-hosting-custom-domain-walkthrough-domain-registry)
