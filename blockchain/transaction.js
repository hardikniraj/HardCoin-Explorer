/*
=====================================================
        HardCoin Explorer
        Transaction Model
=====================================================
*/

const crypto = require("crypto");

class Transaction {

    constructor(fromAddress, toAddress, amount) {

        // Unique Transaction ID
        this.id = crypto.randomUUID();

        // Sender Wallet
        this.fromAddress = fromAddress;

        // Receiver Wallet
        this.toAddress = toAddress;

        // Coin Amount
        this.amount = Number(amount);

        // Timestamp
        this.timestamp = new Date();

        // Transaction Status
        this.status = "Pending";

    }

    // Mark Transaction Successful
    confirm() {

        this.status = "Confirmed";

    }

    // Cancel Transaction
    cancel() {

        this.status = "Cancelled";

    }

    // Return Complete Details
    getDetails() {

        return {

            id: this.id,

            fromAddress: this.fromAddress,

            toAddress: this.toAddress,

            amount: this.amount,

            timestamp: this.timestamp,

            status: this.status

        };

    }

}

module.exports = Transaction;