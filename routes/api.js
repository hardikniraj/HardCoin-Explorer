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
const Wallet = require("../blockchain/wallet");
const hardCoin = storage.blockchain;
const wallets = storage.wallets;

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

        blockchainValid: hardCoin.isChainValid(),

        latestBlock:

            hardCoin.chain.length > 0

                ? hardCoin.getLatestBlock().index

                : 0

    });

});

/*
=====================================================
                BLOCKS
=====================================================
*/

router.get("/blocks", (req, res) => {

    res.json(hardCoin.chain);

});

/*
=====================================================
            SINGLE BLOCK
=====================================================
*/

router.get("/block/:index", (req, res) => {

    const block = hardCoin.getBlock(req.params.index);

    if (!block) {

        return res.status(404).json({

            success: false,

            message: "Block not found."

        });

    }

    res.json(block);

});

/*
=====================================================
        PENDING TRANSACTIONS
=====================================================
*/

router.get("/pending", (req, res) => {

    res.json(hardCoin.pendingTransactions);

});

/*
=====================================================
                WALLETS
=====================================================
*/

router.get("/wallets", (req, res) => {

    const data = wallets.map(wallet => {

        return {

            ...wallet.getDetails(),

            balance:

                hardCoin.getBalanceOfAddress(

                    wallet.address

                )

        };

    });

    res.json(data);

});

/*
=====================================================
            CREATE WALLET
=====================================================
*/

router.post("/wallet", (req, res) => {

    const { name } = req.body;

    if (!name || name.trim() === "") {

        return res.status(400).json({

            success: false,

            message: "Wallet name required."

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

/*
=====================================================
            RENAME WALLET
=====================================================
*/

router.put("/wallet/:id", (req, res) => {

    const { id } = req.params;

    const { name } = req.body;

    const wallet = wallets.find(

        w => w.id === id

    );

    if (!wallet) {

        return res.status(404).json({

            success: false,

            message: "Wallet not found."

        });

    }

    wallet.rename(name);

    res.json({

        success: true,

        wallet: wallet.getDetails(),

        message: "Wallet renamed."

    });

});
/*
=====================================================
            DELETE WALLET
=====================================================
*/

router.delete("/wallet/:id", (req, res) => {

    const { id } = req.params;

    const index = wallets.findIndex(

        wallet => wallet.id === id

    );

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

/*
=====================================================
            CREATE TRANSACTION
=====================================================
*/

router.post("/transaction", (req, res) => {

    const {

        fromAddress,

        toAddress,

        amount

    } = req.body;

    const sender = wallets.find(

        w => w.address === fromAddress

    );

    const receiver = wallets.find(

        w => w.address === toAddress

    );

    if (!sender || !receiver) {

        return res.status(404).json({

            success: false,

            message: "Sender or Receiver not found."

        });

    }

    const balance = hardCoin.getBalanceOfAddress(

        sender.address

    );

    if (balance < Number(amount)) {

        return res.status(400).json({

            success: false,

            message: "Insufficient balance."

        });

    }

    const transaction = new Transaction(

        sender.address,

        receiver.address,

        Number(amount)

    );

    hardCoin.addTransaction(transaction);

    res.status(201).json({

        success: true,

        message: "Transaction added successfully.",

        transaction

    });

});

/*
=====================================================
        GET TRANSACTION BY ID
=====================================================
*/

router.get("/transaction/:id", (req, res) => {

    const transaction = hardCoin.getTransaction(

        req.params.id

    );

    if (!transaction) {

        return res.status(404).json({

            success: false,

            message: "Transaction not found."

        });

    }

    res.json(transaction);

});

/*
=====================================================
                MINE BLOCK
=====================================================
*/

router.post("/mine", (req, res) => {

    const { minerAddress } = req.body;

    const miner = wallets.find(

        w => w.address === minerAddress

    );

    if (!miner) {

        return res.status(404).json({

            success: false,

            message: "Miner wallet not found."

        });

    }

    hardCoin.minePendingTransactions(

        miner.address

    );

    res.json({

        success: true,

        message: "Block mined successfully.",

        reward: hardCoin.miningReward,

        totalBlocks: hardCoin.chain.length,

        pendingTransactions:

            hardCoin.pendingTransactions.length

    });

});

/*
=====================================================
            BLOCKCHAIN VALIDATION
=====================================================
*/

router.get("/validate", (req, res) => {

    res.json({

        valid:

            hardCoin.isChainValid(),

        blocks:

            hardCoin.chain.length,

        difficulty:

            hardCoin.difficulty,

        reward:

            hardCoin.miningReward

    });

});
/*
=====================================================
                DEVELOPER FAUCET
=====================================================
*/
console.log("✅ Faucet route loaded");
router.post("/faucet", (req, res) => {

    const { address, amount } = req.body;

    const wallet = wallets.find(

        w => w.address === address

    );

    if (!wallet) {

        return res.status(404).json({

            success: false,

            message: "Wallet not found."

        });

    }

    const transaction = new Transaction(

        null,

        wallet.address,

        Number(amount)

    );

    transaction.confirm();

    hardCoin.pendingTransactions.push(transaction);

    hardCoin.minePendingTransactions(wallet.address);

    res.json({

        success: true,

        message: `${amount} HC added successfully.`,

        wallet: wallet.getDetails()

    });

});
/*
=====================================================
                STATISTICS
=====================================================
*/

router.get("/stats", (req, res) => {

    let confirmedTransactions = 0;

    let totalCoins = 0;

    hardCoin.chain.forEach(block => {

        block.transactions.forEach(tx => {

            confirmedTransactions++;

            totalCoins += Number(tx.amount);

        });

    });

    res.json({

        totalBlocks: hardCoin.chain.length,

        totalWallets: wallets.length,

        pendingTransactions: hardCoin.pendingTransactions.length,

        confirmedTransactions,

        difficulty: hardCoin.difficulty,

        miningReward: hardCoin.miningReward,

        blockchainValid: hardCoin.isChainValid(),

        totalCoins

    });

});

/*
=====================================================
            SEARCH WALLET
=====================================================
*/

router.get("/wallet/:id", (req, res) => {

    const wallet = wallets.find(

        w =>

            w.id === req.params.id ||

            w.address === req.params.id

    );

    if (!wallet) {

        return res.status(404).json({

            success: false,

            message: "Wallet not found."

        });

    }

    res.json({

        ...wallet.getDetails(),

        balance: hardCoin.getBalanceOfAddress(

            wallet.address

        )

    });

});

/*
=====================================================
            HEALTH CHECK
=====================================================
*/

router.get("/health", (req, res) => {

    res.json({

        success: true,

        server: "HardCoin Explorer",

        status: "Running",

        uptime: process.uptime(),

        timestamp: new Date()

    });

});

/*
=====================================================
                API TEST
=====================================================
*/

router.get("/test", (req, res) => {

    res.json({

        success: true,

        message: "HardCoin API is Working",

        version: "1.0.0"

    });

});

/*
=====================================================
                DEFAULT API
=====================================================
*/

router.get("/", (req, res) => {

    res.json({

        project: "HardCoin Explorer",

        version: "1.0.0",

        endpoints: [

            "/dashboard",

            "/wallets",

            "/wallet",

            "/transaction",

            "/mine",

            "/blocks",

            "/block/:index",

            "/pending",

            "/stats",

            "/validate",

            "/health",

            "/faucet",

            "/test"

        ]

    });

});

/*
=====================================================
                EXPORT ROUTER
=====================================================
*/

module.exports = router;