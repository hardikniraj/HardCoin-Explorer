/*
=====================================================
        HardCoin Explorer
        REST API
=====================================================
*/

const express = require("express");
const router = express.Router();

const storage = require("../data/storage");
const Transaction = require("../blockchain/transaction");

const hardCoin = storage.blockchain;
const wallets = storage.wallets;

// =====================================================
// Dashboard
// =====================================================

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

// =====================================================
// Get All Blocks
// =====================================================

router.get("/blocks", (req, res) => {

    res.json(hardCoin.chain);

});

// =====================================================
// Get Pending Transactions
// =====================================================

router.get("/pending", (req, res) => {

    res.json(hardCoin.pendingTransactions);

});

// =====================================================
// Get All Wallets
// =====================================================

router.get("/wallets", (req, res) => {

    const walletData = wallets.map(wallet => wallet.getDetails());

    res.json(walletData);

});

// =====================================================
// Create Wallet
// =====================================================

router.post("/wallet", (req, res) => {

    const { name } = req.body;

    if (!name || name.trim() === "") {

        return res.status(400).json({
            success: false,
            message: "Wallet name is required."
        });

    }

    const wallet = new Wallet(name);

    wallets.push(wallet);

    res.status(201).json({

        success: true,
        message: "Wallet created successfully.",
        wallet: wallet.getDetails()

    });

});

// =====================================================
// Rename Wallet
// =====================================================

router.put("/wallet/:id", (req, res) => {

    const { id } = req.params;
    const { name } = req.body;

    const wallet = wallets.find(w => w.id === id);

    if (!wallet) {

        return res.status(404).json({

            success: false,
            message: "Wallet not found."

        });

    }

    if (!name || name.trim() === "") {

        return res.status(400).json({

            success: false,
            message: "Wallet name is required."

        });

    }

    wallet.rename(name);

    res.json({

        success: true,
        message: "Wallet renamed successfully.",
        wallet: wallet.getDetails()

    });

});

// =====================================================
// Delete Wallet
// =====================================================

router.delete("/wallet/:id", (req, res) => {

    const { id } = req.params;

    const index = wallets.findIndex(wallet => wallet.id === id);

    if (index === -1) {

        return res.status(404).json({

            success: false,
            message: "Wallet not found."

        });

    }

    const deletedWallet = wallets[index];

    wallets.splice(index, 1);

    res.json({

        success: true,
        message: "Wallet deleted successfully.",
        wallet: deletedWallet.getDetails()

    });

});

// =====================================================
// API Test
// =====================================================

router.get("/test", (req, res) => {

    res.send("✅ HardCoin API is Working");

});

// =====================================================

module.exports = router;