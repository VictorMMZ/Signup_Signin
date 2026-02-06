// VARIABLES GLOBALES
const SERVICE_URL = "/CRUDBankServerSide/webresources/account/customer/";
const ACCOUNT_URL = "/CRUDBankServerSide/webresources/account/";

document.addEventListener("DOMContentLoaded", () => {

    pageLoadHandler();
    

    const nombre = `${sessionStorage.getItem("customer.firstName")} ${sessionStorage.getItem("customer.lastName")}`;
    const infoDiv = document.querySelector(".infousu");
    if (infoDiv) infoDiv.innerHTML = `<p style="color:#00ff00;">Hola, ${nombre}</p>`;

 
    const formAccount = document.getElementById("formAccount");
    if (formAccount) {
        formAccount.onsubmit = async (event) => {
            event.preventDefault();
            
            const custIdRaw = sessionStorage.getItem("customer.id");
            if (!custIdRaw) return alert("Sesión expirada");

     
            const idLimpio = custIdRaw.replace(/[,.]/g, "").trim();
            const creditInput = document.getElementById("accCredit");

            // Creamos el objeto JSON que espera el servidor
            const nuevaCuenta = {
                id: Math.floor(Math.random() * 100000000), // ID aleatorio simple
                description: document.getElementById("accDesc").value,
                balance: 0.0,
                creditLine: typeSelect.value === "CREDIT" ? parseFloat(creditInput.value) : 0.0, // Si es tipo 'CREDIT', tomamos el valor del input, si no, 0.0
                beginBalance: 0.0,
                beginBalanceTimestamp: new Date().toISOString().split('.')[0] + "Z",
                "customers": [{ "id": idLimpio }], 
                type:typeSelect.value
            };

            try {
                // Enviamos los datos al servidor mediante POST
                const response = await fetch(ACCOUNT_URL, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Accept": "application/json" 
                    },
                    body: JSON.stringify(nuevaCuenta)
                });

                if (response.ok) {
                    formAccount.reset();
                    await pageLoadHandler(); 
                } else {
                    alert("Error creando la cuenta.");
                }
            } catch (error) {
                console.error("Error en POST:", error);
            }
        };
    }
});


async function pageLoadHandler() {
    try {
        const rawId = sessionStorage.getItem("customer.id");
        if (!rawId) return;
        
        const customerId = rawId.replace(/[,.]/g, "");
        const response = await fetch(`${SERVICE_URL}${customerId}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Accept": "application/json" 
                    }
                });
      

        if (response.ok) {
            const rawData = await response.json(); 
            
            const accounts = rawData.map(acc => new Account(
                acc.id, 
                acc.description, 
                acc.balance, 
                acc.creditLine, 
                acc.beginBalance, 
                acc.beginBalanceTimestamp, 
                acc.type
            ));

            calculateGlobalBalance(accounts); // Actualizamos el saldo total 

            const tbody = document.getElementById("tableBody");
            if (tbody) {
                tbody.innerHTML = ""; // Limpiamos la tabla antes de rellenarla
                
                // Generador para crear las filas una a una
                const rowGenerator = userRowGenerator(accounts);
                for (const row of rowGenerator) {
                    tbody.appendChild(row);
                }
            }
        }
    } catch (e) {
        console.error("Error cargando datos:", e);
    }
}

function* userRowGenerator(accounts) {
    const currency = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
    const dateFmt = new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });

    for (const acc of accounts) {
        const tr = document.createElement("tr");
        
        tr.innerHTML = `
            <td>${acc._id}</td>
            <td>${acc._description}</td>
            <td>${acc._creditLine > 0 ? "💳 CREDIT" : "💰 STANDARD"}</td>
            <td>${currency.format(acc._creditLine)}</td>
            <td>${dateFmt.format(new Date(acc._beginBalanceTimestamp))}</td>
            <td style="color: #00ff00; font-weight: bold;">${currency.format(acc._balance)}</td>
            <td>
                <button class="neon-button" style="width:auto; padding:5px 10px;" 
                    onclick="goToMovements('${acc._id}', '${acc._balance}', '${acc._creditLine}')">👁️ Ver</button>
                <button class="neon-button" style="width:auto; padding:5px 10px; background:#ef4444;" 
                    onclick="deleteAccount('${acc._id}')">🗑️ Borrar</button>
            </td>
        `;
        yield tr;
    }
}

function goToMovements(id, balance, credit,beginBalance) {
    sessionStorage.setItem("account.id", id);
    sessionStorage.setItem("account.balance", balance);
    sessionStorage.setItem("account.creditLine", credit);
    sessionStorage.setItem("account.beginBalance", beginBalance);
    window.location.href = "movements.html";
}

// Envía una petición DELETE al servidor para eliminar una cuenta
async function deleteAccount(id) {
    if (confirm(`¿Eliminar cuenta ${id}?`)) {
        await fetch(ACCOUNT_URL + id, { method: "DELETE" }); // RA7: Comunicación asíncrona
        await pageLoadHandler();
    }
}


function calculateGlobalBalance(accounts) {
    const total = accounts.reduce((sum, acc) => sum + (parseFloat(acc._balance) || 0), 0);
    const formatted = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(total);
    const elTop = document.getElementById("totalBalanceTop");
    if (elTop) elTop.textContent = formatted;
}
