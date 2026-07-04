/*
=========================================================
                HardCoin Explorer
                Frontend Controller
=========================================================
*/

const API = "/api";

/*
=========================================================
                Dashboard Elements
=========================================================
*/

const blockCount = document.getElementById("blockCount");
const walletCount = document.getElementById("walletCount");
const pendingCount = document.getElementById("pendingCount");
const chainStatus = document.getElementById("chainStatus");

/*
=========================================================
                Wallet Elements
=========================================================
*/

const walletContainer = document.getElementById("walletContainer");

const walletName = document.getElementById("walletName");

const createWalletBtn = document.getElementById("createWalletBtn");

const fromWallet = document.getElementById("fromWallet");

const toWallet = document.getElementById("toWallet");

/*
=========================================================
            Transaction Elements
=========================================================
*/

const amount = document.getElementById("amount");

const sendBtn = document.getElementById("sendBtn");

/*
=========================================================
                Mining Elements
=========================================================
*/

const mineBtn = document.getElementById("mineBtn");

const mineProgress = document.getElementById("mineProgress");

const miningStatus = document.getElementById("miningStatus");

/*
=========================================================
            Explorer Elements
=========================================================
*/

const explorer = document.getElementById("blockchainExplorer");

/*
=========================================================
            Wallet Balance Chart
=========================================================
*/

let walletChart = null;

/*
=========================================================
            Toast Notification
=========================================================
*/

function toast(message, color = "#198754") {

    const toast = document.createElement("div");

    toast.innerText = message;

    toast.style.position = "fixed";

    toast.style.top = "20px";

    toast.style.right = "20px";

    toast.style.padding = "15px 25px";

    toast.style.background = color;

    toast.style.color = "#fff";

    toast.style.fontWeight = "600";

    toast.style.borderRadius = "10px";

    toast.style.zIndex = "99999";

    toast.style.boxShadow = "0 8px 20px rgba(0,0,0,.3)";

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 2500);

}

/*
=========================================================
                Dashboard Loader
=========================================================
*/

async function loadDashboard() {

    try {

        const response = await fetch(API + "/dashboard");

        const data = await response.json();

        blockCount.innerText = data.totalBlocks;

        walletCount.innerText = data.totalWallets;

        pendingCount.innerText = data.pendingTransactions;

        if (data.blockchainValid) {

            chainStatus.innerText = "VALID";

            chainStatus.className = "text-success";

        }

        else {

            chainStatus.innerText = "INVALID";

            chainStatus.className = "text-danger";

        }

    }

    catch (error) {

        console.error(error);

        toast("Unable to load dashboard", "#dc3545");

    }

}

/*
=========================================================
                Wallet Loader
=========================================================
*/

async function loadWallets() {

    try {

        const response = await fetch(API + "/wallets");

        const wallets = await response.json();

        walletContainer.innerHTML = "";

        fromWallet.innerHTML = "";

        toWallet.innerHTML = "";

        const chartLabels = [];

        const chartData = [];

        wallets.forEach(wallet => {

            chartLabels.push(wallet.name);

            chartData.push(wallet.balance);

            walletContainer.innerHTML += `

            <div class="col-lg-4 mb-4">

                <div class="glass-card p-4 h-100">

                    <h4>👤 ${wallet.name}</h4>

                    <hr>

                    <small class="text-info">

                        ${wallet.address}

                    </small>

                    <h3 class="mt-3">

                        ${wallet.balance} HC

                    </h3>

                    <span class="badge bg-success">

                        ${wallet.status}

                    </span>

                    <div class="mt-3">

                        <button

                            class="btn btn-sm btn-warning me-2"

                            onclick="renameWallet('${wallet.id}')">

                            Rename

                        </button>

                        <button

                            class="btn btn-sm btn-danger"

                            onclick="deleteWallet('${wallet.id}')">

                            Delete

                        </button>

                    </div>

                </div>

            </div>

            `;

            fromWallet.innerHTML += `

                <option value="${wallet.address}">

                    ${wallet.name}

                </option>

            `;

            toWallet.innerHTML += `

                <option value="${wallet.address}">

                    ${wallet.name}

                </option>

            `;

        });

        renderChart(chartLabels, chartData);

    }

    catch (error) {

        console.error(error);

        toast("Unable to load wallets", "#dc3545");

    }

}
/*
=========================================================
                Create Wallet
=========================================================
*/

createWalletBtn.addEventListener("click", async () => {

    const name = walletName.value.trim();

    if (name === "") {

        toast("Please enter wallet name", "#dc3545");

        return;

    }

    try {

        const response = await fetch(API + "/wallet", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                name

            })

        });

        const data = await response.json();

        if (data.success) {

            toast("Wallet Created Successfully");

            walletName.value = "";

            const modal = bootstrap.Modal.getInstance(

                document.getElementById("walletModal")

            );

            if (modal) {

                modal.hide();

            }

            await loadDashboard();

            await loadWallets();

        }

        else {

            toast(data.message, "#dc3545");

        }

    }

    catch (error) {

        console.error(error);

        toast("Unable to create wallet", "#dc3545");

    }

});

/*
=========================================================
                Rename Wallet
=========================================================
*/

async function renameWallet(id) {

    const name = prompt("Enter new wallet name");

    if (!name) return;

    try {

        const response = await fetch(

            API + "/wallet/" + id,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    name

                })

            }

        );

        const data = await response.json();

        toast(data.message);

        await loadWallets();

    }

    catch (error) {

        console.error(error);

        toast("Unable to rename wallet", "#dc3545");

    }

}

/*
=========================================================
                Delete Wallet
=========================================================
*/

async function deleteWallet(id) {

    if (!confirm("Delete this wallet?")) {

        return;

    }

    try {

        const response = await fetch(

            API + "/wallet/" + id,

            {

                method: "DELETE"

            }

        );

        const data = await response.json();

        toast(data.message);

        await loadDashboard();

        await loadWallets();

    }

    catch (error) {

        console.error(error);

        toast("Unable to delete wallet", "#dc3545");

    }

}

/*
=========================================================
                Wallet Chart
=========================================================
*/

function renderChart(labels, balances) {

    const canvas = document.getElementById("walletChart");

    if (!canvas) return;

    if (walletChart) {

        walletChart.destroy();

    }

    walletChart = new Chart(canvas, {

        type: "bar",

        data: {

            labels,

            datasets: [

                {

                    label: "Wallet Balance",

                    data: balances,

                    borderWidth: 2

                }

            ]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                y: {

                    beginAtZero: true

                }

            }

        }

    });

}

/*
=========================================================
                Create Transaction
=========================================================
*/

sendBtn.addEventListener("click", async () => {

    const fromAddress = fromWallet.value;

    const toAddress = toWallet.value;

    const coinAmount = Number(amount.value);

    if (

        fromAddress === "" ||

        toAddress === "" ||

        coinAmount <= 0

    ) {

        toast("Invalid transaction", "#dc3545");

        return;

    }

    try {

        const response = await fetch(

            API + "/transaction",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    fromAddress,

                    toAddress,

                    amount: coinAmount

                })

            }

        );

        const data = await response.json();

        toast(data.message);

        amount.value = "";

        await loadDashboard();

    }

    catch (error) {

        console.error(error);

        toast("Transaction failed", "#dc3545");

    }

});
/*
=========================================================
                Mine Blockchain
=========================================================
*/

mineBtn.addEventListener("click", async () => {

    const minerAddress = fromWallet.value;

    if (!minerAddress) {

        toast("Select a miner wallet", "#dc3545");

        return;

    }

    mineBtn.disabled = true;

    mineProgress.style.width = "0%";
    mineProgress.innerText = "0%";

    miningStatus.innerHTML = "⛏ Mining Started...";

    let progress = 0;

    const animation = setInterval(() => {

        progress += 10;

        if (progress > 100) progress = 100;

        mineProgress.style.width = progress + "%";
        mineProgress.innerText = progress + "%";

    }, 250);

    try {

        const response = await fetch(API + "/mine", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                minerAddress

            })

        });

        const data = await response.json();

        clearInterval(animation);

        mineProgress.style.width = "100%";
        mineProgress.innerText = "100%";

        miningStatus.innerHTML = "✅ " + data.message;

        toast("Mining Completed!");

        await loadDashboard();

        await loadWallets();

        await loadExplorer();

    }

    catch (error) {

        clearInterval(animation);

        console.error(error);

        toast("Mining Failed", "#dc3545");

        miningStatus.innerHTML = "❌ Mining Failed";

    }

    mineBtn.disabled = false;

});

/*
=========================================================
            Blockchain Explorer
=========================================================
*/

async function loadExplorer() {

    try {

        const response = await fetch(API + "/blocks");

        const blocks = await response.json();

        explorer.innerHTML = "";

        blocks.forEach(block => {

            explorer.innerHTML += `

            <div class="col-lg-6">

                <div class="glass-card p-4 h-100">

                    <h3>

                        ⛓ Block #${block.index}

                    </h3>

                    <hr>

                    <p>

                        <strong>Hash</strong>

                    </p>

                    <small class="text-info">

                        ${block.hash}

                    </small>

                    <hr>

                    <p>

                        <strong>Previous Hash</strong>

                    </p>

                    <small>

                        ${block.previousHash}

                    </small>

                    <hr>

                    <p>

                        <strong>Transactions</strong>

                    </p>

                    <h5>

                        ${block.transactions.length}

                    </h5>

                    <hr>

                    <p>

                        <strong>Nonce</strong>

                    </p>

                    <h5>

                        ${block.nonce}

                    </h5>

                </div>

            </div>

            `;

        });

    }

    catch (error) {

        console.error(error);

    }

}

/*
=========================================================
                Auto Refresh
=========================================================
*/

async function refreshAll() {

    await loadDashboard();

    await loadWallets();

    await loadExplorer();

}

setInterval(refreshAll, 10000);

/*
=========================================================
                Initialize
=========================================================
*/

window.addEventListener("load", async () => {

    await refreshAll();

});

/*
=========================================================
                    End of File
=========================================================
*/