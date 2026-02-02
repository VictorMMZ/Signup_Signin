/* * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

const SERVICE_URL = "http://localhost:8080/CRUDBankServerSide/webresources/movement/";
let movements;

// CAMBIO AQUÍ: Recuperamos dinámicamente el ID guardado al pulsar "View" en accounts.html
const idaccount = sessionStorage.getItem("account.id"); 
const accountid = "account/" + idaccount;

/**
 * Generator function that yields table rows
 */

// Verificación de seguridad: Si no hay cuenta seleccionada, redirigir
if (!idaccount) {
    alert("No se ha seleccionado ninguna cuenta.");
    window.location.href = "accounts.html";
}

const sesionusu = document.querySelector(".infousu");
sesionusu.innerHTML = `<p> ${sessionStorage.getItem("customer.firstName")} ${sessionStorage.getItem("customer.lastName")} </p>`;

const infoidaccount = document.querySelector(".idaccount");
infoidaccount.innerHTML = `<p> Account ID:  ${idaccount} </p>`;

const infoaccounttype = document.querySelector(".accounttype");

const formateadorEU = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2 // Asegura dos decimales
});

// ... EL RESTO DE TU CÓDIGO SE MANTIENE EXACTAMENTE IGUAL ...

document.addEventListener("DOMContentLoaded", () => {
    if (!idaccount) {
        window.location.href = "accounts.html";
        return;
    }

    // Mostrar información en la cabecera
    const sesionusu = document.querySelector(".infousu");
    if (sesionusu) sesionusu.innerHTML = `<p>${sessionStorage.getItem("customer.firstName")} ${sessionStorage.getItem("customer.lastName")}</p>`;

    const infoidaccount = document.querySelector(".idaccount");
    if (infoidaccount) infoidaccount.innerHTML = `<p>Account ID: ${idaccount}</p>`;

    buildMovementsTable();
    setupFormToggles();
});

// 1. GENERADOR DE FILAS (REQUISITO YIELD)
function* movementsRowGenerator(movements) {
    for (const movement of movements) {
        const tr = document.createElement("tr");
        ["timestamp", "description", "amount", "balance"].forEach(field => {
            const td = document.createElement("td");
            let value = movement[field];

            if (field === "amount" || field === "balance") {
                td.style.color = (field === "amount" && value < 0) ? "#ef4444" : "#00ff00";
                value = formateadorEU.format(value);
            }
            td.textContent = value;
            tr.appendChild(td);
        });
        yield tr;
    }
}

// 2. FETCH Y PARSEO XML (ESTILO COMPAÑERO)
async function fetchMovements() {
    const response = await fetch(`${SERVICE_URL}${accountid}?t=${new Date().getTime()}`, {
        method: "GET",
        headers: { "Accept": "application/xml" }
    });
    const xmlText = await response.text();
    return parseMovementsXML(xmlText);
}

function parseMovementsXML(xmlText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");
    const movementsArray = [];
    const nodes = xmlDoc.getElementsByTagName("movement");

    for (const node of nodes) {
        movementsArray.push({
            timestamp: new Date(node.getElementsByTagName("timestamp")[0].textContent).toLocaleString("es-ES"),
            description: node.getElementsByTagName("description")[0].textContent,
            amount: parseFloat(node.getElementsByTagName("amount")[0].textContent),
            balance: parseFloat(node.getElementsByTagName("balance")[0].textContent),
            id: node.getElementsByTagName("id")[0].textContent
        });
    }
    return movementsArray;
}

// 3. OPERACIONES (POST XML)
async function createDepositMovement(event) {
    event.preventDefault();
    try {
        const amount = parseFloat(document.getElementById("totaldepo").value);
        if (isNaN(amount) || amount <= 0) throw new Error("Monto no válido");

        const oldBalance = movements.length > 0 ? movements[movements.length - 1].balance : 0;
        const newBalance = oldBalance + amount;

        const xmlBody = `
            <movement>
                <timestamp>${new Date().toISOString()}</timestamp>
                <amount>${amount}</amount>
                <balance>${newBalance}</balance>
                <description>Deposit</description>
            </movement>`.trim();

        const response = await fetch(SERVICE_URL + idaccount, {
            method: "POST",
            headers: { "Content-Type": "application/xml" },
            body: xmlBody
        });

        if (response.ok) {
            await putAccount(newBalance);
            await buildMovementsTable();
            document.getElementById("formDeposit").style.display = "none";
        }
    } catch (error) { alert(error.message); }
}

// 4. ACTUALIZACIÓN DE SALDO EN CUENTA (PUT XML)
async function putAccount(newBalance) {
    // Obtenemos la cuenta actual para no perder los otros datos (JSON/XML compatible)
    const response = await fetch(`${ACCOUNT_URL}${idaccount}`, {
        headers: { "Accept": "application/xml" }
    });
    const xmlText = await response.text();
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    // Actualizamos solo el nodo balance
    xmlDoc.getElementsByTagName("balance")[0].textContent = newBalance;

    const serializer = new XMLSerializer();
    const updatedXML = serializer.serializeToString(xmlDoc);

    await fetch(ACCOUNT_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/xml" },
        body: updatedXML
    });
}

async function buildMovementsTable() {
    movements = await fetchMovements();
    const tbody = document.getElementById("tbodyMovements");
    if (tbody) {
        tbody.innerHTML = "";
        const rowGenerator = movementsRowGenerator(movements);
        for (const row of rowGenerator) {
            tbody.appendChild(row);
        }
    }
    
    // Actualizar balance visual
    const currentBal = movements.length > 0 ? movements[movements.length - 1].balance : 0;
    const balanceusu = document.querySelector(".infobalance");
    if (balanceusu) balanceusu.innerHTML = `<p>Balance: ${formateadorEU.format(currentBal)}</p>`;
}

function setupFormToggles() {
    const btnDepo = document.getElementById("deposit");
    const btnTake = document.getElementById("take");
    const fDepo = document.getElementById("formDeposit");
    const fTake = document.getElementById("formTake");

    if(btnDepo) btnDepo.onclick = () => { fDepo.style.display = "block"; fTake.style.display = "none"; };
    if(btnTake) btnTake.onclick = () => { fTake.style.display = "block"; fDepo.style.display = "none"; };
}