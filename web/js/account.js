// VARIABLES GLOBALES (Rutas relativas para evitar errores de puerto)
const SERVICE_URL = "/CRUDBankServerSide/webresources/account/customer/";
const ACCOUNT_URL = "/CRUDBankServerSide/webresources/account/";
/**
 * @fixme UPDATE: Implementar la actualización del campo description de las cuentas, independientemente de su tipo, y, además del campo creditLine para las de crédito.
 */
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
            //TODO Utilizar la siguiente RegExp para validar que los importes (beginBalance y creditLine) pueda introducirse con separador de decimales y de miles.
            const esAmountRegex = /^(?:\d{1,15}|\d{1,3}(?:\.\d{3}){1,4})(?:,\d{1,2})?$/;
            /* Explanation for esAmountRegex:
              (?:                                # integer part options
                \d{1,15}                         # 1 to 15 digits without thousand separator
                | \d{1,3}(?:\.\d{3}){1,4}        # 1–3 digits, then 1–4 groups of ".ddd"
               )
              (?:,\d{1,2})?                      # optional decimal with 1 or 2 digits
             */

     
            const idLimpio = custIdRaw.replace(/[,.]/g, "").trim();
            const typeSelect = document.getElementById("accTypeSelect");
            const creditInput = document.getElementById("accCredit");
            //FIXME: Al crear la cuenta el usuario puede introducir un saldo inicial. El saldo actual en la apertura de cuenta será igual a este saldo inicial.

            //FIXME: Encapsular los datos de la nueva cuenta en un objeto de la clase Account.
            const nuevaCuenta = {
                id: Math.floor(Math.random() * 100000000),
                description: document.getElementById("accDesc").value,
                balance: 0.0,
                creditLine: typeSelect.value === "CREDIT" ? parseFloat(creditInput.value) : 0.0,
                beginBalance: 0.0,
                beginBalanceTimestamp: new Date().toISOString().split('.')[0] + "Z",
                "customers": [{ "id": idLimpio }], 
                type:typeSelect.value
            };

            try {
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
                    alert("Error creating account.");
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

            console.log("Cuentas cargadas con guiones bajos:", accounts);

            calculateGlobalBalance(accounts); 

            const tbody = document.getElementById("tableBody");
            if (tbody) {
                tbody.innerHTML = "";
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
/**
 * 
 * @param {type} id
 * @return {undefined}
 * @fixme DELETE: Solo se podrán borrar cuentas que no tengan movimientos.Controlar esta condición para no realizar petición de borrado al servidor y así evitar el HTTP 500 por violación de integridad referencial.

 */
async function deleteAccount(id) {
    if (confirm(`¿Eliminar cuenta ${id}?`)) {
        await fetch(ACCOUNT_URL + id, { method: "DELETE" });
        await pageLoadHandler();
    }
}


function calculateGlobalBalance(accounts) {
    const total = accounts.reduce((sum, acc) => sum + (parseFloat(acc._balance) || 0), 0);
    const formatted = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(total);
    const elTop = document.getElementById("totalBalanceTop");
    if (elTop) elTop.textContent = formatted;
}