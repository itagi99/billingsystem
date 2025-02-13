let serialNo = 1;
let grandTotal = 0;
let billNumber = 1;

// Keyboard Shortcuts
document.addEventListener("keydown", (e) => {
    // Esc: Open the "Add Item" popup
    if (e.key === "Escape") showPopup();

    // Alt: Close the popup
    if (e.key === "Alt") closePopup();

    // F3: Reset the bill
    if (e.key === "F3") resetBill();

    // Ctrl + P: Print the receipt
    if (e.ctrlKey && e.key === "p") {
        e.preventDefault(); // Prevent default print dialog
        printReceipt();
    }
});

// Handle Enter key in the popup
document.getElementById("popup").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault(); // Prevent form submission
        let currentInput = document.activeElement.id;

        if (currentInput === "productName") {
            document.getElementById("quantity").focus();
        } else if (currentInput === "quantity") {
            document.getElementById("rate").focus();
        } else if (currentInput === "rate") {
            addItemFromPopup(); // Add item and close the popup
        }
    }
});

function showPopup() {
    document.getElementById("popup").style.display = "block";
    document.getElementById("productName").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("rate").value = "";
    document.getElementById("productName").focus();
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function addItemFromPopup() {
    let productName = document.getElementById("productName").value || "N/A";
    let quantity = parseFloat(document.getElementById("quantity").value) || 1;
    let rate = parseFloat(document.getElementById("rate").value) || 0;

    if (isNaN(quantity) || isNaN(rate)) {
        alert("Invalid entry! Please enter numbers.");
        return;
    }

    addItem(productName, quantity, rate);
    closePopup();
}

function addItem(productName, quantity, rate) {
    let table = document.getElementById("billBody");
    let row = document.createElement("tr");
    let totalPrice = quantity * rate;

    row.innerHTML = `
        <td>${serialNo}</td>
        <td>${productName}</td>
        <td>${quantity.toFixed(2)}</td>
        <td>${rate.toFixed(2)}</td>
        <td>${totalPrice.toFixed(2)}</td>
        <td class="action-column"><span class="remove-btn" onclick="removeItem(this, ${totalPrice})">X</span></td>
    `;

    table.appendChild(row);
    grandTotal += totalPrice;
    document.getElementById("grandTotal").textContent = grandTotal.toFixed(2);
    updateQRCode();
    serialNo++;
}

function removeItem(element, price) {
    element.parentElement.parentElement.remove();
    grandTotal -= price;
    document.getElementById("grandTotal").textContent = grandTotal.toFixed(2);
    updateQRCode();
}

function resetBill() {
    if (confirm("Are you sure you want to reset the bill?")) {
        document.getElementById("billBody").innerHTML = "";
        document.getElementById("grandTotal").textContent = "0.00";
        document.getElementById("cashReceived").value = "";
        document.getElementById("balance").textContent = "0.00";
        grandTotal = 0;
        serialNo = 1;
        updateQRCode();
    }
}

function calculateBalance() {
    let cashReceived = parseFloat(document.getElementById("cashReceived").value) || 0;
    let balance = cashReceived - grandTotal;
    document.getElementById("balance").textContent = balance.toFixed(2);
    updateQRCode();
}

function updateQRCode() {
    let balance = parseFloat(document.getElementById("balance").textContent) || 0;
    let qrAmount = balance < 0 ? Math.abs(balance) : grandTotal; // Use balance if negative, else grand total
    document.getElementById("qrcode").innerHTML = "";
    let qrText = `upi://pay?pa=6363304520@okbizaxis&pn=StoreName&am=${qrAmount.toFixed(2)}&cu=INR`;
    new QRCode(document.getElementById("qrcode"), { text: qrText, width: 128, height: 128 });
}

function printReceipt() {
    window.print();
}

// Save Bill as Image
function saveBillAsImage() {
    html2canvas(document.getElementById("receipt-content")).then(canvas => {
        let link = document.createElement("a");
        link.download = `Bill_${billNumber}.png`; // File name
        link.href = canvas.toDataURL("image/png"); // Save as PNG
        link.click();
        billNumber++; // Increment bill number for next save
    });
}
