#!/usr/bin/env node
const commandLineArgs = require('command-line-args')
const randomizer = require('./src/Randomizer')
const pkg = require('./package.json')

const optionDefinitions = [
  {
    name: 'help',
    alias: 'h',
    type: Boolean
  },
  {
    name: 'extract',
    alias: 'e',
    type: Boolean
  },
  {
    name: 'generate',
    alias: 'g',
    type: Number
  },
  {
    name: 'shuffle',
    alias: 's',
    type: Boolean
  }
]

function error(message) {
  if (!Array.isArray(message)) {
    message = [message]
  }
  console.error(message[0])
  if (message[1]) {
    console.info(message[1])
  }
  /*eslint-disable-next-line*/
  process.exit(1)
}

let options = {}
try {
  options = commandLineArgs(optionDefinitions, {
    camelCase: true
  })
} catch (e) {
  error(e.message)
}

options.isCLI = true

console.info(`Metadata Randomizer v${pkg.version}`)

if (options.help || Object.keys(options).length === 1) {
  console.info(`A simple tool to randomize the IDs for the reveal of MOBLAND characters.

Options:
  -h, --help               This help.
  -e, --extract            Extracts males and females from the metadata
                             to prepare the second reveal
  -g, --generate [number]  Generate the snapshot file used for the randomization
  -v, --shuffle            Shuffle the data to extract the sets of 250 IDs, from the first
                             block number to the last inserted in the snapshot2.json file
Examples:
  ./randomizer.js -e              (extract the IDs by gender) 
  ./randomizer.js -g 22383749     (generate snapshot2.json starting from that block number)
`)
  // eslint-disable-next-line no-process-exit
  process.exit(0)
}

randomizer.run(options)
    .then(() => process.exit(0))
    .catch(e => {
      console.error(e.message)
      process.exit(1)
    })

