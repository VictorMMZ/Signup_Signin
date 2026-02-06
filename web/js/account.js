// VARIABLES GLOBALES
const SERVICE_URL = "/CRUDBankServerSide/webresources/account/customer/";
const ACCOUNT_URL = "/CRUDBankServerSide/webresources/account/";

document.addEventListener("DOMContentLoaded", () => {

    // Al cargar la página, pedimos los datos al servidor
    pageLoadHandler();

    // Nombre del usuario guardado en el navegador (sessionStorage)
    const nombre = `${sessionStorage.getItem("customer.firstName")} ${sessionStorage.getItem("customer.lastName")}`;
    const infoDiv = document.querySelector(".infousu");
    if (infoDiv) infoDiv.innerHTML = `<p style="color:#00ff00;">Hola, ${nombre}</p>`;

    // Controla la visibilidad del campo "Límite de Crédito" basándose en el tipo de cuenta seleccionado.
    const typeSelect = document.getElementById("accTypeSelect");
    const divCred = document.getElementById("divCred");
    
    if (typeSelect && divCred) {
        typeSelect.addEventListener("change", () => {
            divCred.style.display = typeSelect.value === "CREDIT" ? "block" : "none"; // Si el valor es 'CREDIT', muestra el campo; de lo contrario, lo oculta
        });
    }

    // Envío del formulario para crear nuevas cuentas
    const formAccount = document.getElementById("formAccount");
    if (formAccount) {
        formAccount.onsubmit = async (event) => {
            event.preventDefault();
            
            const custIdRaw = sessionStorage.getItem("customer.id");
            if (!custIdRaw) return alert("Sesión expirada");

            // Limpiamos el ID del cliente (quitamos comas o puntos si los hay)
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
                type: typeSelect.value
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
                    if (divCred) divCred.style.display = "none"; 
                    await pageLoadHandler(); // Refrescamos la tabla de cuentas
                } else {
                    alert("Error creando la cuenta.");
                }
            } catch (error) {
                console.error("Error en POST:", error);
            }
        };
    }
});

// Función para obtener y mostrar las cuentas del usuario
async function pageLoadHandler() {
    try {
        const rawId = sessionStorage.getItem("customer.id");
        if (!rawId) return;
        
        const customerId = rawId.replace(/[,.]/g, "");
        
        // Pedimos al servidor las cuentas asociadas al ID de cliente
        const response = await fetch(`${SERVICE_URL}${customerId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "Accept": "application/json" }
        });

        if (response.ok) {
            const rawData = await response.json(); 
            
            // Convertimos la respuesta cruda en instancias de la clase 'Account'
            const accounts = rawData.map(acc => new Account(
                acc.id, acc.description, acc.balance, acc.creditLine, 
                acc.beginBalance, acc.beginBalanceTimestamp, acc.type
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

// Generador. Crea los elementos HTML (tr) de la tabla 
function* userRowGenerator(accounts) {
    const currency = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
    const dateFmt = new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });

    // Dentro de la función userRowGenerator(accounts)
for (const acc of accounts) {
    const tr = document.createElement("tr");
    
    // Contenido HTML en cada fila
    tr.innerHTML = `
        <td>${acc._id}</td>
        <td>${acc._description}</td>
        <td>${acc._creditLine > 0 ? "💳 CREDIT" : "💰 STANDARD"}</td>
        <td>${currency.format(acc._creditLine)}</td>
        <td>${dateFmt.format(new Date(acc._beginBalanceTimestamp))}</td>
        <td class="balance-cell">${currency.format(acc._balance)}</td>
        <td>
            <div class="actions-container">
                <button class="neon-button btn-small" 
                    onclick="goToMovements('${acc._id}', '${acc._balance}', '${acc._creditLine}', '${acc._beginBalance}')">
                    👁️ Ver
                </button>
                <button class="neon-button btn-small btn-delete" 
                    onclick="deleteAccount('${acc._id}')">
                    🗑️ Borrar
                </button>
            </div>
        </td>
    `;
    yield tr; // Entrega la fila terminada al bucle 
}
}

// Guarda los datos de la cuenta seleccionada y  lleva a la página de movimientos
function goToMovements(id, balance, credit, beginBalance) {
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

// Suma el saldo de todas las cuentas y lo muestra 
function calculateGlobalBalance(accounts) {
    const total = accounts.reduce((sum, acc) => sum + (parseFloat(acc._balance) || 0), 0);
    const formatted = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(total);
    const elTop = document.getElementById("totalBalanceTop");
    if (elTop) elTop.textContent = formatted;
}