// ===============================
// ✅ Expenses Logic
// ===============================
let expences = JSON.parse(localStorage.getItem("expencesData")) || [];
const tableBody = document.querySelector("#expencesTable tbody");

function saveToLocalStorage() {
    localStorage.setItem("expencesData", JSON.stringify(expences));
}

function displayExpences() {
    tableBody.innerHTML = "";
    let totalMoney = 0;

    expences.forEach((exp, index) => {
    totalMoney += exp.expencesTk;
    const row = `
        <tr>
        <td class="border py-2">${index + 1}</td>
        <td class="border py-2">৳${exp.expencesTk}</td>
        <td class="border py-2">${exp.date}</td>
        </tr>`;
    tableBody.innerHTML += row;
    });

    document.getElementById("total__money").innerText = `Total Expenses: ৳${totalMoney}`;
}

document.getElementById("studentForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const expencesTk = Number(document.getElementById("expencesTk").value);
    if (!expencesTk) return alert("⚠️ Please enter an amount!");

    const formattedDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    });

    expences.push({ expencesTk, date: formattedDate });
    saveToLocalStorage();
    displayExpences();
    e.target.reset();
});

document.getElementById("deleteBtn").addEventListener("click", () => {
    if (expences.length === 0) return alert("⚠️ No expense to delete!");
    if (confirm("Delete last expense?")) {
    expences.pop();
    saveToLocalStorage();
    displayExpences();
    }
});

document.getElementById("restartBtn").addEventListener("click", () => {
    if (expences.length === 0) return;
    if (confirm("Delete all expenses?")) {
    expences = [];
    localStorage.removeItem("expencesData");
    displayExpences();
    alert("✅ All data cleared!");
    }
});

displayExpences();
