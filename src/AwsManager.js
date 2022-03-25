const path = require('path')
const fs = require('fs')
const {requirePath} = require('require-or-mock')
const mime = require('mime-types')

const AWS = require('aws-sdk')
AWS.config.loadFromPath(requirePath('.env.awsConfig.json', {
  accessKeyId: '',
  secretAccessKey: '',
  region: 'us-east-2'
}))

class AwsManager {

  constructor() {
    this.s3 = new AWS.S3({apiVersion: '2006-03-01'})
  }

  async listBuckets() {
    const data = await this.s3.listBuckets().promise()
    return data.Buckets
  }

  async uploadFile(file, folder = '') {
    if (fs.existsSync(file)) {
      let fileStream = fs.createReadStream(file)
      fileStream.on('error', function (err) {
        console.error('File Error', err)
      })
      const uploadParams = {
        Bucket: 'data-syn-city',
        Key: folder + (folder ? '/' : '') + path.basename(file),
        Body: fileStream,
        ACL: 'public-read',
        ContentType: mime.lookup(file)
      }

      const data = await this.s3.upload(uploadParams).promise()
      if (data) {
        return data.Location
      }
    } else {
      return false
    }
  }

  async listObjectsInBucket(Bucket) {
    return this.s3.listObjects({
      Bucket,
    }).promise()
  }

}

module.exports = new AwsManager
