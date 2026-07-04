/*
=========================================
        HardCoin Explorer
        Frontend JavaScript
=========================================
*/

const API = "/api";

/*
=========================================
Dashboard Elements
=========================================
*/

const blockCount = document.getElementById("blockCount");
const walletCount = document.getElementById("walletCount");
const pendingCount = document.getElementById("pendingCount");

/*
=========================================
Wallet Elements
=========================================
*/

const walletContainer = document.getElementById("walletContainer");
const fromWallet = document.getElementById("fromWallet");
const toWallet = document.getElementById("toWallet");

/*
=========================================
Dashboard
=========================================
*/

async function loadDashboard() {

    const response = await fetch(API + "/dashboard");

    const data = await response.json();

    blockCount.innerText = data.totalBlocks;
    walletCount.innerText = data.totalWallets;
    pendingCount.innerText = data.pendingTransactions;

}

/*
=========================================
Load Wallets
=========================================
*/

async function loadWallets() {

    const response = await fetch(API + "/wallets");

    const wallets = await response.json();

    walletContainer.innerHTML = "";

    fromWallet.innerHTML = "";

    toWallet.innerHTML = "";

    wallets.forEach(wallet => {

        walletContainer.innerHTML += `

        <div class="col-lg-4 mb-4">

            <div class="glass-card p-4">

                <h4>👤 ${wallet.name}</h4>

                <hr>

                <p><strong>Address</strong></p>

                <small>${wallet.address}</small>

                <h3 class="mt-3">${wallet.balance} HC</h3>

                <span class="badge bg-success">

                    ${wallet.status}

                </span>

            </div>

        </div>

        `;

        fromWallet.innerHTML += `

            <option value="${wallet.name}">

                ${wallet.name}

            </option>

        `;

        toWallet.innerHTML += `

            <option value="${wallet.name}">

                ${wallet.name}

            </option>

        `;

    });

}

/*
=========================================
Initialize
=========================================
*/

window.onload = () => {

    loadDashboard();

    loadWallets();

};