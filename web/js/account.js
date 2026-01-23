/**
 * URL del servicio RESTful para obtener las cuentas de un cliente
 */
const SERVICE_URL = "http://localhost:8080/CRUDBankServerSide/webresources/account/customer/";

/**
 * Función generadora que emite filas de tabla
 * Genera cada fila (tr) dinámicamente usando yield
 */
function* accountRowGenerator(accounts) {
    for (const account of accounts) {
        const tr = document.createElement("tr"); //
        
        // Mapeamos los campos del XML: id, description, balance, creditLine
        ["id", "description", "balance", "creditLine"].forEach(field => {
            const td = document.createElement("td");
            let value = account[field];

            // Aplicamos formato REAL (decimales) como pide el profe
            if (field === "balance" || field === "creditLine") {
                value = parseFloat(value).toFixed(2) + " €";
                // Si el balance es negativo, lo ponemos en rojo
                if (field === "balance" && parseFloat(account[field]) < 0) {
                    td.style.color = "red";
                }
            }
            
            td.textContent = value; //
            tr.appendChild(td); //
        });

        // Añadimos un botón de acción para conectar con la parte de Víctor
        const tdAction = document.createElement("td");
        const btn = document.createElement("button");
        btn.textContent = "Ver Movimientos";
        btn.className = "acceder"; // Clase de tu CSS
        btn.onclick = () => {
            sessionStorage.setItem("currentAccount.id", account.id);
            window.location.href = "movements.html";
        };
        tdAction.appendChild(btn);
        tr.appendChild(tdAction);

        yield tr; //
    }
}

/**
 * Recupera las cuentas en formato XML del servidor
 */
async function fetchAccounts() {
    // Obtenemos el ID del cliente guardado en el login
    const customerId = sessionStorage.getItem("customer.id");

    const response = await fetch(SERVICE_URL + customerId, {
        method: "GET", //
        headers: {
            "Accept": "application/xml" //
        }
    });
    const xmlText = await response.text(); //
    return parseAccountsXML(xmlText); //
}

/**
 * Procesa el texto XML y devuelve un array de objetos
 */
function parseAccountsXML(xmlText) {
    const parser = new DOMParser(); //
    const xmlDoc = parser.parseFromString(xmlText, "application/xml"); //
    const accounts = [];
    const accountNodes = xmlDoc.getElementsByTagName("account"); //

    for (const node of accountNodes) {
        accounts.push({
            id: node.getElementsByTagName("id")[0].textContent,
            description: node.getElementsByTagName("description")[0].textContent,
            balance: node.getElementsByTagName("balance")[0].textContent,
            creditLine: node.getElementsByTagName("creditLine")[0].textContent
        });
    }
    return accounts; //
}

/**
 * Construye la tabla al cargar la página
 */
async function buildAccountsTable() {
    const accounts = await fetchAccounts(); //
    const tbody = document.querySelector("#accountsTable tbody"); //
    
    if (!tbody) return;
    tbody.innerHTML = ""; // Limpiamos contenido previo

    const rowGenerator = accountRowGenerator(accounts); //
    for (const row of rowGenerator) {
        tbody.appendChild(row); //
    }
}

// Llamada automática al cargar la página
buildAccountsTable();