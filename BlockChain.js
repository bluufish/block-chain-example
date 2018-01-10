const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }


    //proof of work
    mineBlock(difficulty) {
        //until the hash contains a certain amount of zeroes in the front
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock];
        this.difficulty = 2;
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2018", "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length-1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}
//create a block chain and add some money
let blockCoin = new BlockChain();

console.log('Mining block 1...');
blockCoin.addBlock(new Block(1, "1/9/2018", {amount : 4}));

console.log('Mining block 2...')
blockCoin.addBlock(new Block(2, "1/10/2017", {amount: 10}));

console.log(JSON.stringify(blockCoin, null, 4));

//check if our newly created blockchain is valid
console.log(`Is blockchain valid? ${blockCoin.isChainValid()}`)

//tampering with the blockchain and its hash
blockCoin.chain[1].data = {amount: 100};
blockCoin.chain[1].hash = blockCoin.chain[1].calculateHash()

//checks to see the validity of our tampered blockchain
console.log(`Is blockchain valid? ${blockCoin.isChainValid()}`)



