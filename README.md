# Self-hosted primo (WIP)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

The goal of this project is to make it possible to run primo on your own node server - including everything needed to run the typical CMS like authentication, the ability to invite collaborators, a database for code and content, etc.

Setup and maintenance should be as simple as possible, so MongoDB Atlas will be used as a database and AWS S3 + Cloudflare will be used for hosting, and both will be configured from primo during setup. This way, the only steps which should be necessary to get the primo server up and running will be:

1. Click 'Deploy to Heroku' button
1. Open app and go through setup (account, db, hosting) 

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
