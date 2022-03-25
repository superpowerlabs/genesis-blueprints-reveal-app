# Mobland Genesis Blueprints Reveal App

A simple tool to shuffle the metadata of the Genesis Blueprint tokens and reveal the final tokens.

### Introduction

8000 Limited Edition Blueprints have been deployed to BSC on November 30th (https://bscscan.com/tx/0x4149f9c7cbc51cd62c5834ee15754de8794973181c9f334dfeaa04ead1d037ef), with a single attribute `Status: Unrevealed`.

This repo manages the process necessary to reveal the attributes and rarity of any NFT in the collection.

This app will manage the reveal process.

#### The flow

The entire set of metadata is in `input/allMetadata.json`. Its order is not related to the order of the NFT, the file is needed to generate the final order.

**Stage 1**

1. Chose a future block on the Ethereum blockchain. 
2. Include the selected block in the file `input/snapshot.json` and update this repo.
3. Commit and push to GitHub.

**Stage 2**

1. When the block is mined, include its hash in the snapshot file
2. Shuffle the metadata. The script will generate 8000 JSON files in the `output` folder
3. Commit and push the update to GitHub. 

**Stage 3**
1. Upload all the metadata to S3. 
2. Update the token URI of the NFT.

When the process is complete, you will be able to see all the metadata on any marketplace that updates the data. Also, we will publish a special app to show all the tokens by attributes.


### A future block

The chosen block is [14457289](https://etherscan.io/block/14457289). It should be minted around 12pm PST, on Friday, March 25th 2022. 

When the block is mined this repo will be updated and ready to shuffle the metadata.

### Shuffle the data

First off, install the dependencies
``` 
npm i -g pnpm
pnpm install
```

When the hash is updated in `input/snapshot.json`, run
``` 
./shuffler.js --shuffle
```

It will generate 8000 metadata json files in `/output`

Anyone can run it again to confirm that the repo is unchanged and the shuffling is fair.

#### For admin-only
As soon as the metadata are shuffled, push the metadata to S3 with
```
./shuffler.js --upload-metadata
```
and later update the tokenURI in the NFT at https://bscscan.com/token/0x1ec94be5c72cf0e0524d6ecb6e7bd0ba1700bf70#writeContract

#### 8000 results Vs 8888 items

The Blueprint Limited Editions NFT has a total supply of 8000 tokens. However, the total amount of blueprints is 8888, as you can check in `input/allMetadata.json`. After the shuffling process, the first 8000 will be assigned to the Blueprint Limited Edition, the remaining 888 metadata, will be set in a file `input/notShuffledMetadata.json` generated during the shuffle process. Those data will be used in the future, when the blueprints will be swapped for in-game characters. 

### Validate a video

The name of the videos is generated taking the first 16 chars of the SHA256 of the file, to guarantee that the files in the metadata are not changed arbitrarily after the shuffle.

To validate an MP4 file, download it and launch a command like
``` 
./shuffle --verify 0d1b201da0e53aee.mp4
```

All the images, are single frames extracted from the videos, since the videos are not unique. To validate any of them, run, for example:
``` 
./shuffle --verify 89ed87ac7676ff35.png
```


### Credits

Author: [Francesco Sullo](https://github.com/sullof)

(c) 2022 Superpower Labs Inc.

### License
MIT
# genesis-blueprints-reveal-app
