/*
=====================================================
        HardCoin Explorer
        Global Storage
=====================================================
*/

const Blockchain = require("../blockchain/blockchain");
const Wallet = require("../blockchain/wallet");

const blockchain = new Blockchain();

const wallets = [
    new Wallet("Hardik"),
    new Wallet("Rahul"),
    new Wallet("Aman")
];

module.exports = {

    blockchain,

    wallets

};