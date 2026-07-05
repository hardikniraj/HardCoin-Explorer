/*
=====================================================
        HardCoin Explorer
        Blockchain Model
=====================================================
*/

const Block = require("./block");
const Transaction = require("./transaction");

class Blockchain {

    constructor() {

        // Blockchain starts with Genesis Block
        this.chain = [this.createGenesisBlock()];

        // Mining Difficulty
        this.difficulty = 3;

        // Pending Transactions
        this.pendingTransactions = [];

        // Reward after successful mining
        this.miningReward = 100;

    }

    /*
    ===========================================
            Genesis Block
    ===========================================
    */

    createGenesisBlock() {

        return new Block(

            0,
            Date.now(),
            [],
            "0"

        );

    }

    /*
    ===========================================
            Latest Block
    ===========================================
    */

    getLatestBlock() {

        return this.chain[this.chain.length - 1];

    }

    /*
    ===========================================
            Add Transaction
    ===========================================
    */

    addTransaction(transaction) {

        if (!(transaction instanceof Transaction)) {

            throw new Error("Invalid Transaction");

        }

        this.pendingTransactions.push(transaction);

    }

    /*
    ===========================================
            Mine Pending Transactions
    ===========================================
    */

   minePendingTransactions(minerAddress) {

    // Reward transaction first
    const rewardTransaction = new Transaction(
        null,
        minerAddress,
        this.miningReward
    );

    rewardTransaction.confirm();

    // Confirm all pending transactions
    this.pendingTransactions.forEach(tx => {
        tx.confirm();
    });

    // Include reward in the block being mined
    const transactions = [
        ...this.pendingTransactions,
        rewardTransaction
    ];

    const block = new Block(
        this.chain.length,
        Date.now(),
        transactions,
        this.getLatestBlock().hash
    );

    block.mineBlock(this.difficulty);

    this.chain.push(block);

    // Clear pending transactions
    this.pendingTransactions = [];
}
    /*
    ===========================================
            Wallet Balance
    ===========================================
    */

    getBalanceOfAddress(address) {

        let balance = 0;

        for (const block of this.chain) {

            for (const tx of block.transactions) {

                if (tx.fromAddress === address) {

                    balance -= tx.amount;

                }

                if (tx.toAddress === address) {

                    balance += tx.amount;

                }

            }

        }

        return balance;

    }

    /*
    ===========================================
            Blockchain Validation
    ===========================================
    */

    isChainValid() {

        for (let i = 1; i < this.chain.length; i++) {

            const currentBlock = this.chain[i];

            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {

                return false;

            }

            if (currentBlock.previousHash !== previousBlock.hash) {

                return false;

            }

        }

        return true;

    }

    /*
    ===========================================
            Search Block
    ===========================================
    */

    getBlock(index) {

        return this.chain.find(

            block => block.index == index

        );

    }

    /*
    ===========================================
            Search Transaction
    ===========================================
    */

    getTransaction(id) {

        for (const block of this.chain) {

            const tx = block.transactions.find(

                t => t.id === id

            );

            if (tx) {

                return tx;

            }

        }

        return null;

    }

}

module.exports = Blockchain;