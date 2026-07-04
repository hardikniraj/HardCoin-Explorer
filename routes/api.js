/*
=====================================================
        HardCoin Explorer
        REST API
=====================================================
*/

const express = require("express");
const router = express.Router();

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
                GET ALL BLOCKS
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

/*
=====================================================
            GET ALL WALLETS
=====================================================
*/

router.get("/wallets", (req, res) => {

    const walletData = wallets.map(wallet => ({
        id: wallet.id,
        name: wallet.name,
        address: wallet.address,
        balance: wallet.balance,
        status: wallet.status,
        createdAt: wallet.createdAt
    }));

    res.json(walletData);

});

/*
=====================================================
                API TEST
=====================================================
*/

router.get("/test", (req, res) => {

    res.send("✅ HardCoin API is Working");

});

module.exports = router;