/*
=====================================================
        HardCoin Explorer
        REST API
=====================================================
*/
console.log("🚀 LOADED routes/api.js");
const express = require("express");
const router = express.Router();
console.log("✅ API routes loaded");
const Blockchain = require("../blockchain/blockchain");
const Wallet = require("../blockchain/wallet");
const Transaction = require("../blockchain/transaction");

// ============================================
// Blockchain Instance
// ============================================

const hardCoin = new Blockchain();

// ============================================
// Wallet Storage
// ============================================

const wallets = [

    new Wallet("Hardik"),
    new Wallet("Rahul"),
    new Wallet("Aman")

];

/*
=====================================================
                DASHBOARD
=====================================================
*/

router.get("/dashboard", (req, res) => {

    res.json({

        totalBlocks: hardCoin.chain.length,

        totalWallets: wallets.length,

        pendingTransactions: hardCoin.pendingTransactions.length,

        difficulty: hardCoin.difficulty,

        miningReward: hardCoin.miningReward,

        blockchainValid: hardCoin.isChainValid()

    });

});

/*
=====================================================
                GET BLOCKS
=====================================================
*/

router.get("/blocks", (req, res) => {

    res.json(hardCoin.chain);

});

/*
=====================================================
            GET PENDING TRANSACTIONS
=====================================================
*/

router.get("/pending", (req, res) => {

    res.json(hardCoin.pendingTransactions);

});
router.get("/test", (req, res) => {
    res.send("API is working!");
});
module.exports = router;