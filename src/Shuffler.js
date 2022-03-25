const crypto = require('crypto')
const fs = require('fs-extra')
const path = require('path')
const Metashu = require('@ndujalabs/metashu')

const snapshot = require('../input/snapshot.json')

class Shuffler {

  async run(opt) {
    if (opt.shuffle) {
      return this.shuffleMetadata(opt)
    } else if (opt.verify) {
      return this.verifyFile(opt)
    }
  }

  async sha256File(file) {
    const fileBuffer = await fs.readFile(file)
    const hashSum = crypto.createHash('sha256')
    hashSum.update(fileBuffer)
    return hashSum.digest('hex')
  }

  async verifyFile(opt) {
    let fn = path.resolve(process.cwd(), opt.verify)
    if (!(await fs.pathExists(fn))) {
      console.error('File not found')
      process.exit(1)
    }
    let mp4Sha256 = await this.sha256File(fn)
    if(path.basename(fn).split('.')[0] === mp4Sha256.substring(0, 16)) {
      console.log('Success. File name is derived from SHA256(file)')
    } else {
      console.log('File name is not consistent with SHA256(file)')
    }
  }

  async shuffleMetadata(opt) {
    const salt = snapshot.hash
    // if allMetadata has not been previously saved, it throws an exception
    const outputDir = path.resolve(__dirname, '../output')
    await fs.ensureDir(outputDir)
    const options = {
      input: path.resolve(__dirname, '../input/allMetadata.json'),
      output: outputDir,
      salt,
      prefix: "Mobland Genesis Blueprint #",
      addTokenId: true,
      limit: 8000,
      remaining: path.resolve(__dirname, '../input/notShuffledMetadata.json'),
    }
    const metashu = new Metashu(options)
    await metashu.shuffle()
  }

}

module.exports = new Shuffler()
