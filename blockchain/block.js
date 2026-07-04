/*
=====================================================
        HardCoin Explorer
        Block Model
=====================================================
*/

const SHA256 = require("crypto-js/sha256");

class Block {

    constructor(index, timestamp, transactions, previousHash = "") {

        // Block Number
        this.index = index;

        // Block Creation Time
        this.timestamp = timestamp;

        // Transactions Stored
        this.transactions = transactions;

        // Previous Block Hash
        this.previousHash = previousHash;

        // Nonce (used in mining)
        this.nonce = 0;

        // Difficulty achieved
        this.difficulty = 0;

        // Mining Time
        this.miningTime = 0;

        // Current Block Hash
        this.hash = this.calculateHash();

    }

    /*
    ============================================
            Generate SHA-256 Hash
    ============================================
    */

    calculateHash() {

        return SHA256(

            this.index +
            this.previousHash +
            this.timestamp +
            JSON.stringify(this.transactions) +
            this.nonce

        ).toString();

    }

    /*
    ============================================
            Proof of Work Mining
    ============================================
    */

    mineBlock(difficulty) {

        console.log("\n⛏ Mining Block #" + this.index);

        const startTime = Date.now();

        while (

            this.hash.substring(0, difficulty) !==
            Array(difficulty + 1).join("0")

        ) {

            this.nonce++;

            this.hash = this.calculateHash();

        }

        const endTime = Date.now();

        this.difficulty = difficulty;

        this.miningTime = ((endTime - startTime) / 1000).toFixed(2);

        console.log("✅ Block Mined Successfully");
        console.log("Hash :", this.hash);
        console.log("Nonce :", this.nonce);
        console.log("Time :", this.miningTime + " sec");

    }

}

module.exports = Block;