const AWS = require('aws-sdk')
const s3 = new AWS.S3();

async function setupS3(args) {
  await setCredentials(args)
  const [ response ] = await Promise.all([ 
    createBucket({ 
      name: 'primo-private', 
      region: args.region
    }),
    createBucket({ 
      name: 'primo-public', 
      region: args.region,
      public: true
    })
  ])
  return response
}

async function setCredentials({ keyID, accessKey, region }) {
  // TODO: Set credentials in environment variable
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region
  })
}

async function createBucket({ name, region, public = false }) {
  const Bucket = `${name}-${require('uuid').v4()}`
  try {
    await s3.createBucket({
      Bucket,
      ACL: public ? 'public-read' : 'private',
      CreateBucketConfiguration: {
        LocationConstraint: region
      },
    }).promise()
    enableVersioning(Bucket)
    return { success: true }
  } catch(e) {
    // console.error(e)
    return { error: e }
  }

  function enableVersioning(Bucket) {
    var params = {
      Bucket, 
      VersioningConfiguration: {
        MFADelete: "Disabled", 
        Status: "Enabled"
      }
    };
    s3.putBucketVersioning(params, function(err, data) {
      if (err) console.log(err, err.stack); 
      else console.log(data);
    });
  }
}

async function uploadFile({ name, content, type = null, public = true }) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key : name,
    Body : content,
    ContentType: type || 'text/'+name.split('.')[1], // get file type from extension
    ACL: public ? 'public-read' : 'private'
  };

  try {
    const stored = await s3.upload(params).promise()
    const {Key,Location} = stored
    return {
      name: Key,
      url: Location
    }
  } catch (err) {
    console.log(err)
  }
}

async function downloadFile(name) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key : name
  };
  try {
    const {Body} = await s3.getObject(params).promise()
    return Body
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  uploadFile,
  downloadFile,
  setupS3
}