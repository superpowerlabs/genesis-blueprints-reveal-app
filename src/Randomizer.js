const path = require('path')
const fs = require('fs-extra')
const ethers = require("ethers")

class Randomizer {

  async run(opt) {
    if (opt.extract) {
      return this.extractIDs()
    } else if (opt.generate) {
      return this.generateSnapshot(opt)
    } else if (opt.shuffle) {
      return this.shuffle()
    }
  }

  async extractIDs() {
    const dir = await fs.readdir(path.resolve(__dirname, "../output"))
    const males = []
    const females = []
    for (let fn of dir) {
      if (/^\d+$/.test(fn)) {
        let meta = JSON.parse(await fs.readFile(path.resolve(__dirname, "../output", fn), "utf8"))
        if (meta.attributes[0].value === "Male") {
          males.push(meta.tokenId)
        } else {
          females.push(meta.tokenId)
        }
      }
    }
    const sort = (a,b) => {
      a = parseInt(a)
      b = parseInt(b)
      return a > b ? 1 : a < b ? -1 : 0;
    }
    await fs.writeFile(path.resolve(__dirname, "../input/allMaleIDs.json"), JSON.stringify(males.sort(sort)))
    await fs.writeFile(path.resolve(__dirname, "../input/allFemaleIDs.json"), JSON.stringify(females.sort(sort)))
  }

  async generateSnapshot(opt) {
    const initialBlockNumber = parseInt(opt.generate);
    const snapshot = []
    for (let i = 0; i < 32; i++) {
      let blockNumber = initialBlockNumber + (i * 8 * 3600)
      snapshot.push({
        blockNumber,
        hash: "",
        link: "https://bscscan.com/block/countdown/" + blockNumber
      })
    }
    await fs.writeFile(path.resolve(__dirname, "../input/snapshot2.json"), JSON.stringify(snapshot, null, 2))
  }


  hashed(id, salt) {
    const shuffling = []
    for (let i = 0; i < metadata.length; i++) {
      shuffling.push({
        index: i,
        salted: ethers.utils.id(JSON.stringify(metadata[i]) + salt)
      })
    }
    shuffling.sort((a, b) => {
      a = a.salted
      b = b.salted
      return a > b ? 1 : a < b ? -1 : 0
    })
    return shuffling
  }

  shuffleDay(ids, hash) {
    const hashes = []
    for (let i=0;i< ids.length; i++) {
      hashes.push({
        id: ids[i],
        hash: ethers.utils.id(hash + ids[i])
      });
    }
    const sort = (a,b) => {
      a = a.hash
      b = b.hash
      return a > b ? 1 : a < b ? -1 : 0;
    }
    hashes.sort(sort)
    const res = {
      day: [],
      ids: []
    }
    for (let i=0;i< ids.length; i++) {
      if (i < 250) {
        res.day.push(hashes[i].id)
      } else {
        res.ids.push(hashes[i].id)
      }
    }
    return res
  }

  async shuffle() {
    if (!(await fs.pathExists(path.resolve(__dirname, "../input/allMaleIDs.json")))) {
      return console.info("IDs not extracted")
    }
    if (!(await fs.pathExists(path.resolve(__dirname, "../input/snapshot2.json")))) {
      return console.info("Snapshot not ready, yet")
    }
    let ids = require("../input/allMaleIDs.json")
    const days = []
    let i = 0;
    const snapshot = require("../input/snapshot2.json")
    const lastAllMaleBlock = Math.floor(ids.length / 250)
    for (let block of snapshot) {
      if (i === lastAllMaleBlock) {
        ids = ids.concat(require("../input/allFemaleIDs.json"));
      }
      if (!block.hash) {
        break
      }
      let res = this.shuffleDay(ids, block.hash);
      ids = res.ids;
      days.push(res.day);
      i++;
    }

    for (let i=0; i< days.length; i++) {
      await fs.writeFile(path.resolve(__dirname, "../output2", `day_${i+1}.txt`), days[i].join("\n"))
    }
  }

}

module.exports = new Randomizer()
