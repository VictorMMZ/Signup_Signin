// VARIABLES GLOBALES
const SERVICE_URL = "/CRUDBankServerSide/webresources/account/customer/";
const ACCOUNT_URL = "/CRUDBankServerSide/webresources/account/";

document.addEventListener("DOMContentLoaded", () => {

    pageLoadHandler();

    const nombre = `${sessionStorage.getItem("customer.firstName")} ${sessionStorage.getItem("customer.lastName")}`;
    const infoDiv = document.querySelector(".infousu");
    if (infoDiv) infoDiv.innerHTML = `<p style="color:#00ff00;">Hola, ${nombre}</p>`;

    const typeSelect = document.getElementById("accTypeSelect");
    const divCred = document.getElementById("divCred");
    
    if (typeSelect && divCred) {
        typeSelect.addEventListener("change", () => {
            divCred.style.display = typeSelect.value === "CREDIT" ? "block" : "none"; 
        });
    }

    const formAccount = document.getElementById("formAccount");
    if (formAccount) {
        formAccount.onsubmit = async (event) => {
            event.preventDefault();
            
            const custIdRaw = sessionStorage.getItem("customer.id");
            if (!custIdRaw) return alert("Sesión expirada");

            const idLimpio = custIdRaw.replace(/[,.]/g, "").trim();
            const creditInput = document.getElementById("accCredit");

            const beginBalanceVal = parseFloat(document.getElementById("accBeginBalance").value) || 0.0;
            
           
            const nuevaCuenta = {
                id: Math.floor(Math.random() * 100000000),
                description: document.getElementById("accDesc").value,
                balance: beginBalanceVal, 
                creditLine: typeSelect.value === "CREDIT" ? parseFloat(creditInput.value) : 0.0,
                beginBalance: beginBalanceVal, 
                beginBalanceTimestamp: new Date().toISOString().split('.')[0] + "Z",
                "customers": [{ "id": idLimpio }], 
                type: typeSelect.value
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
                    if (divCred) divCred.style.display = "none"; 
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
                acc.type,
                customerId        
            ));

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
            <td class="balance-cell">${currency.format(acc._balance)}</td>
            <td>
                <div class="actions-container" style="display: flex; gap: 8px; justify-content: center;">
                    <button class="neon-button btn-small" 
                        onclick="goToMovements('${acc._id}', '${acc._balance}', '${acc._creditLine}', '${acc._beginBalance}')">
                        👁️ Ver
                    </button>

                     <button class="neon-button btn-small"
                        id="edit-${acc._id}">
                        ✏️ Editar
                    </button>

                    <button class="neon-button btn-small btn-delete" 
                        onclick="deleteAccount('${acc._id}')">
                        🗑️ Borrar
                    </button>
                </div>
            </td>
        `;

    
        const btnEdit = tr.querySelector(`#edit-${acc._id}`);
        btnEdit.onclick = () => updateDescription(acc);

        yield tr; 
    }
}

function goToMovements(id, balance, credit, beginBalance) {
    sessionStorage.setItem("account.id", id);
    sessionStorage.setItem("account.balance", balance);
    sessionStorage.setItem("account.creditLine", credit);
    sessionStorage.setItem("account.beginBalance", beginBalance);
    window.location.href = "movements.html";
}

async function updateDescription(account) {
    const nuevaDesc = prompt(
        "Editar descripción:",
        account.getDescription()
    );

    if (!nuevaDesc || nuevaDesc.trim() === "") return;

    account.setDescription(nuevaDesc.trim());

    try {
        const response = await fetch(ACCOUNT_URL, { 
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(account.toJSON()) 
        });

        if (response.ok) {
            alert("✅ Descripción actualizada correctamente");
            await pageLoadHandler(); 
        } else {
            alert("❌ Error al actualizar la descripción");
            console.error("Error detalle:", response.status, await response.text());
        }
    } catch (e) {
        console.error("Error de conexión:", e);
    }
}


async function deleteAccount(id) {
    try {
        const responseMovs = await fetch(`/CRUDBankServerSide/webresources/movement/`);
        
        if (responseMovs.ok) {
            const movimientos = await responseMovs.json();

            if (movimientos && movimientos.length > 0) {
                alert(`⚠️ No se puede eliminar la cuenta ${id} porque tiene movimientos asociados. Debe estar vacía.`);
                return; 
            }
        }

       
        if (confirm(`¿Eliminar cuenta ${id}?`)) {
            const res = await fetch(ACCOUNT_URL + id, { method: "DELETE" });
            
            if (res.ok) {
                await pageLoadHandler();
            } else {
                alert("No puedes eliminar la cuenta, tienes movimientos");
            }
        }
    } catch (error) {
        console.error("Error en el proceso de borrado:", error);
        alert("Hubo un problema al conectar con el servidor para verificar los movimientos.");
    }
}

function calculateGlobalBalance(accounts) {
    const total = accounts.reduce((sum, acc) => sum + (parseFloat(acc._balance) || 0), 0);
    const formatted = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(total);
    const elTop = document.getElementById("totalBalanceTop");
    if (elTop) elTop.textContent = formatted;
}
