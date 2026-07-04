/*
=====================================================
        HardCoin Explorer
        Wallet Model
=====================================================
*/

const crypto = require("crypto");

class Wallet {

    constructor(name) {

        // Unique Wallet ID
        this.id = crypto.randomUUID();

        // Wallet Owner Name
        this.name = name;

        // Wallet Address
        this.address =
            "HC-" +
            crypto.randomBytes(6).toString("hex").toUpperCase();

        // Wallet Balance
        this.balance = 0;

        // Wallet Status
        this.status = "Active";

        // Creation Date
        this.createdAt = new Date();

    }

    /*
    ===========================================
            Deposit Coins
    ===========================================
    */

    deposit(amount) {

        amount = Number(amount);

        if (amount <= 0) return false;

        this.balance += amount;

        return true;

    }

    /*
    ===========================================
            Withdraw Coins
    ===========================================
    */

    withdraw(amount) {

        amount = Number(amount);

        if (amount <= 0) return false;

        if (amount > this.balance) {

            return false;

        }

        this.balance -= amount;

        return true;

    }

    /*
    ===========================================
            Rename Wallet
    ===========================================
    */

    rename(newName) {

        if (!newName) return false;

        this.name = newName;

        return true;

    }

    /*
    ===========================================
            Activate Wallet
    ===========================================
    */

    activate() {

        this.status = "Active";

    }

    /*
    ===========================================
            Deactivate Wallet
    ===========================================
    */

    deactivate() {

        this.status = "Inactive";

    }

    /*
    ===========================================
            Wallet Details
    ===========================================
    */

    getDetails() {

        return {

            id: this.id,

            name: this.name,

            address: this.address,

            balance: this.balance,

            status: this.status,

            createdAt: this.createdAt

        };

    }

}

module.exports = Wallet;