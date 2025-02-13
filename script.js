let serialNo = 1;
let grandTotal = 0;
let billNumber = 1;

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
    updateQRCode(grandTotal);
    serialNo++;
}

function calculateBalance() {
    let cashReceived = parseFloat(document.getElementById("cashReceived").value) || 0;
    let balance = cashReceived - grandTotal;
    document.getElementById("balance").textContent = balance.toFixed(2);
}

function updateQRCode(amount) {
    document.getElementById("qrcode").innerHTML = "";
    let qrText = `upi://pay?pa=6363304520@okbizaxis&pn=StoreName&am=${amount.toFixed(2)}&cu=INR`;
    new QRCode(document.getElementById("qrcode"), { text: qrText, width: 128, height: 128 });
}

function printReceipt() {
    window.print();
}

function saveAsImage() {
    html2canvas(document.getElementById("receipt")).then(canvas => {
        let link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "Bill_Receipt.png";
        link.click();
    });
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") showPopup();
    if (event.key === "Alt") closePopup();
    if (event.key === "F3") resetBill();
    if (event.key === "Enter") moveFocus(1);
    if (event.key === "ArrowUp") moveFocus(-1);
});

function moveFocus(step) {
    let inputs = document.querySelectorAll("input");
    let index = [...inputs].indexOf(document.activeElement);
    if (index !== -1 && inputs[index + step]) {
        inputs[index + step].focus();
    }
}
