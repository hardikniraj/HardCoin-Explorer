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
const difficultyCount = document.getElementById("difficultyCount");
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
const blockSearch = document.getElementById("blockSearch");

const searchBtn = document.getElementById("searchBtn");
const activityFeed = document.getElementById("activityFeed");

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
function animateValue(element, value){

    let start = Number(element.innerText) || 0;

    const duration = 500;

    const startTime = performance.now();

    function update(currentTime){

        const progress = Math.min((currentTime-startTime)/duration,1);

        element.innerText = Math.floor(start+(value-start)*progress);

        if(progress<1){

            requestAnimationFrame(update);

        }

    }

    requestAnimationFrame(update);

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

difficultyCount.innerText = data.difficulty;

const mineDifficulty = document.getElementById("mineDifficulty");

if (mineDifficulty) {

    mineDifficulty.innerText = data.difficulty;

}
       animateValue(blockCount,data.totalBlocks);

animateValue(walletCount,data.totalWallets);

animateValue(pendingCount,data.pendingTransactions);

animateValue(difficultyCount,data.difficulty);
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

           <div class="col-lg-4 col-md-6 mb-4">

    <div class="wallet-card h-100">

        <div class="d-flex justify-content-between align-items-start">

            <div>

                <h4 class="mb-1">
                    👤 ${wallet.name}
                </h4>

                <span class="badge bg-success rounded-pill">
                    ${wallet.status}
                </span>

            </div>

        </div>

        <hr>

        <small class="text-secondary d-block mb-2">
            💰 Balance
        </small>

        <div class="wallet-balance mb-3">
            ${wallet.balance} HC
        </div>

        <small class="text-secondary d-block mb-2">
            📍 Wallet Address
        </small>

        <div class="wallet-address mb-3">

            ${wallet.address}

        </div>

        <small class="text-secondary d-block mb-2">
            📅 Created
        </small>

        <div class="mb-4">

            ${new Date(wallet.createdAt).toLocaleDateString()}

        </div>

        <div class="d-grid gap-2">

            <button
                class="btn btn-primary btn-sm"
                onclick="navigator.clipboard.writeText('${wallet.address}');
                toast('📋 Address Copied');">

                📋 Copy Address

            </button>

            <div class="d-flex gap-2">

                <button
                    class="btn btn-warning btn-sm w-50"
                    onclick="renameWallet('${wallet.id}')">

                    ✏ Rename

                </button>

                <button
                    class="btn btn-danger btn-sm w-50"
                    onclick="deleteWallet('${wallet.id}')">

                    🗑 Delete

                </button>

            </div>

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
            addActivity(
    "👤",
    "Wallet Created",
    `${name} wallet has been created.`
);
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
        addActivity(

    "✏",

    "Wallet Renamed",

    `${name}`

);
addActivity(

    "🗑",

    "Wallet Deleted",

    data.wallet.name

);
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

if (!data.success) {
    toast(data.message, "#dc3545");
    return;
}

toast(
    "⏳ Transaction added to the pending pool.\nMine a block to confirm it.",
    "#0dcaf0"
);
const fromName =
    fromWallet.options[fromWallet.selectedIndex].text;

const toName =
    toWallet.options[toWallet.selectedIndex].text;

addActivity(

    "💸",

    "Transaction Created",

    `${fromName} ➜ ${toName} : ${coinAmount} HC`

);
amount.value = "";

await loadDashboard();
await loadWallets();
await loadExplorer();
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

        toast(
    `⛏ Block mined successfully!
Reward +${data.reward} HC`,
    "#198754"
);
addActivity(

    "⛏",

    "Block Mined",

    `Reward +${data.reward} HC`

);
await refreshAll();
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

        blocks.reverse().forEach(block => {

            explorer.innerHTML += `

            <div class="col-lg-6 mb-4">

                <div class="explorer-card h-100">

                    <div class="d-flex justify-content-between align-items-center mb-3">

                        <h4>

                            🧱 Block #${block.index}

                        </h4>

                        <span class="badge bg-success">

                            🟢 VALID

                        </span>

                    </div>

                    <hr>

                    <div class="row">

                        <div class="col-6">

                            <small class="text-secondary">

                                📦 Transactions

                            </small>

                            <h5>

                                ${block.transactions.length}

                            </h5>

                        </div>

                        <div class="col-6">

                            <small class="text-secondary">

                                ⚙ Difficulty

                            </small>

                            <h5>

                                ${block.difficulty}

                            </h5>

                        </div>

                    </div>

                    <div class="row mt-3">

                        <div class="col-6">

                            <small class="text-secondary">

                                🎲 Nonce

                            </small>

                            <h6>

                                ${block.nonce}

                            </h6>

                        </div>

                        <div class="col-6">

                            <small class="text-secondary">

                                ⏱ Mining Time

                            </small>

                            <h6>

                                ${block.miningTime || 0} sec

                            </h6>

                        </div>

                    </div>

                    <hr>

                    <small class="text-secondary">

                        📅 Timestamp

                    </small>

                    <div class="mb-3">

                        ${new Date(block.timestamp).toLocaleString()}

                    </div>

                    <small class="text-secondary">

                        🔐 Hash

                    </small>

                    <div class="hash-box">

                        ${block.hash}

                    </div>

                    <small class="text-secondary mt-3 d-block">

                        🔗 Previous Hash

                    </small>

                    <div class="hash-box">

                        ${block.previousHash}

                    </div>

                </div>

            </div>

            `;

        });

    }

    catch (error) {

        console.error(error);

        toast("Unable to load explorer", "#dc3545");

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
setInterval(async () => {
    await loadDashboard();
}, 10000);
/*
=========================================================
                Activity Feed
=========================================================
*/

function addActivity(icon, title, message){

    if(!activityFeed) return;

    const now = new Date();

    const time = now.toLocaleTimeString([],{

        hour:"2-digit",

        minute:"2-digit"

    });

    const activity = document.createElement("div");

    activity.className = "activity-item";

    activity.innerHTML = `

        <div class="activity-time">

            ${time}

        </div>

        <div class="activity-title">

            ${icon} ${title}

        </div>

        <div class="activity-message">

            ${message}

        </div>

    `;

    activityFeed.prepend(activity);

}
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