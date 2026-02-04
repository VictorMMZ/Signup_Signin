// VARIABLES GLOBALES (Rutas relativas para evitar errores de puerto)
const SERVICE_URL = "/CRUDBankServerSide/webresources/account/customer/";
const ACCOUNT_URL = "/CRUDBankServerSide/webresources/account/";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Carga inicial de datos
    pageLoadHandler();
    
    // 2. Mostrar nombre del usuario en la cabecera
    const nombre = `${sessionStorage.getItem("customer.firstName")} ${sessionStorage.getItem("customer.lastName")}`;
    const infoDiv = document.querySelector(".infousu");
    if (infoDiv) infoDiv.innerHTML = `<p style="color:#00ff00;">Hola, ${nombre}</p>`;

    // 3. CREATE: Manejo del formulario de nueva cuenta
    const formAccount = document.getElementById("formAccount");
    if (formAccount) {
        formAccount.onsubmit = async (event) => {
            event.preventDefault();
            
            const custIdRaw = sessionStorage.getItem("customer.id");
            if (!custIdRaw) return alert("Sesión expirada");

            // Limpieza del ID igual que tu compañero
            const idLimpio = custIdRaw.replace(/[,.]/g, "").trim();
            const typeSelect = document.getElementById("accTypeSelect");
            const creditInput = document.getElementById("accCredit");

            const nuevaCuenta = {
                id: Math.floor(Math.random() * 100000000),
                description: document.getElementById("accDesc").value,
                balance: 0.0,
                creditLine: typeSelect.value === "CREDIT" ? parseFloat(creditInput.value) : 0.0,
                beginBalance: 0.0,
                // Formato de fecha que acepta Glassfish
                beginBalanceTimestamp: new Date().toISOString().split('.')[0] + "Z",
                "customers": [{ "id": idLimpio }], // Relación ManyToMany
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
                    // Esperamos a que el servidor termine antes de recargar
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

/**
 * READ: Obtener cuentas del cliente
 */
/**
 * READ: Obtener cuentas del cliente y convertirlas a objetos de Clase
 */
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
            
            // CONVERSIÓN: Creamos objetos de la clase Account para que tengan los guiones bajos
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

/**
 * GENERADOR DE FILAS (Adaptado a guiones bajos)
 */
function* userRowGenerator(accounts) {
    const currency = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
    const dateFmt = new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });

    for (const acc of accounts) {
        const tr = document.createElement("tr");
        
        // ¡IMPORTANTE! Accedemos a las propiedades con guion bajo (_)
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

async function deleteAccount(id) {
    if (confirm(`¿Eliminar cuenta ${id}?`)) {
        await fetch(ACCOUNT_URL + id, { method: "DELETE" });
        await pageLoadHandler();
    }
}

/**
 * CALCULAR BALANCE (Adaptado a guiones bajos)
 */
function calculateGlobalBalance(accounts) {
    // Usamos acc._balance para que la suma no de 0
    const total = accounts.reduce((sum, acc) => sum + (parseFloat(acc._balance) || 0), 0);
    const formatted = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(total);
    const elTop = document.getElementById("totalBalanceTop");
    if (elTop) elTop.textContent = formatted;
}