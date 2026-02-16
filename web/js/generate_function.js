
/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


const SERVICE_URL = "http://localhost:8080/CRUDBankServerSide/webresources/movement/";
let movements;
const idaccount =  2654785441 ;//sessionStorage.getItem("account.id"); 
const accountid = "account/" + 2654785441;

/**
 * Generator function that yields table rows
 */


const sesionusu = document.querySelector(".infousu");
sesionusu.innerHTML = `<p> ${sessionStorage.getItem("customer.firstName")} ${sessionStorage.getItem("customer.lastName")} </p>`;

const infoidaccount=document.querySelector(".idaccount");
infoidaccount.innerHTML = `<p> Account ID:  ${idaccount} </p>`;

const infoaccounttype= document.querySelector(".accounttype");

// Función principal para ejecutar la búsqueda
function buscarMovimientos() {
    const inicioStr = document.getElementById("fechaInicio").value;
    const finStr = document.getElementById("fechaFin").value;
    const tablaBody = document.getElementById("tbodyMovements");

    if (!movements) return; // Seguridad por si aún no han cargado los datos

    const filtrados = movements.filter(mov => {
        if (!inicioStr && !finStr) return true;

        // IMPORTANTE: Como en el parseo guardaste la fecha ya formateada (DD/MM/YYYY),
        // necesitamos convertirla de nuevo a algo que Date() entienda.
        // Lo más seguro es usar los datos originales si los tuvieras, 
        // pero vamos a reconstruir el objeto Date desde el string:
        
        const partes = mov.timestamp.split(', ')[0].split('/'); // Extrae [DD, MM, YYYY]
        const horas = mov.timestamp.split(', ')[1]; // Extrae HH:MM:SS
        const fechaISO = `${partes[2]}-${partes[1]}-${partes[0]}T${horas}`;
        
        const fechaMov = new Date(fechaISO);
        const fechaInicio = inicioStr ? new Date(inicioStr) : new Date(0);
        const fechaFin = finStr ? new Date(finStr) : new Date();

        // Ajustamos horas para comparar solo días completos
        fechaInicio.setHours(0, 0, 0, 0);
        fechaFin.setHours(23, 59, 59, 999);

        return fechaMov >= fechaInicio && fechaMov <= fechaFin;
    });

    tablaBody.innerHTML = "";
    const generador = movementsRowGenerator(filtrados);
    for (const fila of generador) {
        tablaBody.appendChild(fila);
    }
}
//metodo para sumar lo que haga falta 
//const totalPeriodo = filtrados.reduce((acc, el) => acc + el.amount, 0);
/*const totalIngresos = movements
    .filter(mov => mov.description === "Deposit") // Primero seleccionamos
    .reduce((acc, mov) => acc + mov.amount, 0);
*/

// Escuchar el click del botón
document.getElementById("btnFiltrar").addEventListener("click", buscarMovimientos);

const formateadorEU = new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 2 // Asegura dos decimales
                    });




// funcion para generar tablas 
function* movementsRowGenerator(movements) {
    for (const movement of movements) {
        const tr = document.createElement("tr");

        ["timestamp", "description", "amount", "balance"].forEach(field => {
            const td = document.createElement("td");

            if (field === "amount" || field === "balance") {
    td.textContent = formateadorEU.format(movement[field]);
} else {
    td.textContent = movement[field];
}


            tr.appendChild(td);
        });

        yield tr;
    }
}

 
 // función fetch para recuperar datos del servidor parseando JSON
async function fetchMovements() {
    const response = await fetch(SERVICE_URL + `${accountid}`, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });

    const data = await response.json();

    return parseMovementsJSON(data);
}

    
    //funcion fetch con la ruta del movmiento a elimnar,pasando como parametro el id al llamar a la funcion
    async function fetchMovementsForRemove(deleteid) {
           const response = await fetch(SERVICE_URL + `${deleteid}`, {
            // metodo DELETE para eliminar del servidor y asi mismo de la base de datos
            method: "DELETE",
            headers: {
                "Accept": "application/json"
              }
         });
       
         
       await  buildMovementsTable(); 
         
       
        
      
    }
    
    //funcion accionadora del boton para eliminar el ultimo movimiento
 function deleteLast(event){   
     
     // creamos la variable en la que guardaremos el id del ultimo movimiento ya que cada movimiento tiene un numero de id mayor al anterior
     const lastoperation=movements[movements.length-1].id;
     //llamamos tanto a la funcion fetch de eliminar como al constuir la tabla para que se haga dinamicamente(todavia queda corregir)
     return fetchMovementsForRemove(lastoperation);
     
          
 
}
   
/*
Funcion para confirmar la elminación de la cuenta
*/
async function confirmDelete(event){
    if (confirm("¿Estás seguro de que deseas borrar este movimiento?")) {
        // Si se pulsa si
       
       
       // Llamamos a las funciones que queremos que ocurran una vez confirmemos
   await deleteLast();
   await putAccount();
       
       
} else {
    // Si se pulsa que no 
    console.log("Operación cancelada");
}
}

function parseMovementsJSON(data) {

    const list = Array.isArray(data) ? data : data.movements;

    return list.map(m => {
        const date = m.timestamp; // viene del JSON
        const noFormDate = new Date(date);

        const formatedDate = noFormDate.toLocaleString("es-ES", { 
            year: "numeric",
            month: "2-digit", 
            day: "2-digit", 
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        return {
            id: m.id,
            amount: m.amount,
            description: m.description,
            timestamp: formatedDate,
            balance:m.balance
        };
    });
}



// funcion de Parseo de los datos XML
    function parseMovementsXML(xmlText) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");
        const movements = [];
        const movementsNodes = xmlDoc.getElementsByTagName("movement");
            for (const movementNode of movementsNodes) {
                
                const date=movementNode.getElementsByTagName("timestamp")[0].textContent;
                const noFormDate= new Date(date);
                const formatedDate = noFormDate.toLocaleString("es-ES", { 
                    year: "numeric",
                    month: "2-digit", 
                    day: "2-digit", 
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit" });
              
                const amount=movementNode.getElementsByTagName("amount")[0].textContent;
                
              
                
                const balance=movementNode.getElementsByTagName("balance")[0].textContent;
               
                // hacemos push al array de movimientos para que tenga los datos 
                movements.push({
                    
                    
                  
                    timestamp: formatedDate,
                    description:movementNode.getElementsByTagName("description")[0].textContent,
                    amount: Number(movementNode.getElementsByTagName("amount")[0].textContent),
                    balance: Number(movementNode.getElementsByTagName("balance")[0].textContent),
                    id:movementNode.getElementsByTagName("id")[0].textContent
                    
                    
                });
             }
             
             //devolvemos el array 
        return movements;
     }
     
     
     
     /*
      * Funcion para utilizar la cuenta que nos Adrian de cuentas y utilizar sus datos como si fuese un objeto 
      * 
      */
async function cargarCuenta() {
    const response = await fetch(
        `http://localhost:8080/CRUDBankServerSide/webresources/account/${idaccount}`,
        {
            method: "GET",
            headers: { "Accept": "application/json" }
        }
    );

    const data = await response.json();

    // Convertir JSON → objeto Account
    account = new Account(
        data.id,
        data.description,
        data.balance,
        data.creditLine,
        data.beginBalance,
        data.beginBalanceTimestamp,
        data.type
    );

    infoaccounttype.innerHTML = `<p> Type ${account._type}</p>`;

    return account;
}


/*
 * llamamos al funcion ya qu quermos los datos de la cuenta si o si
 * 
 */
cargarCuenta();
 
     
//Funcion utilizada para llamar a las demas funciones
async function buildMovementsTable() {
    movements = await fetchMovements();
    tbody = document.getElementById("tbodyMovements"); 
    tbody.innerHTML="";
    const rowGenerator = movementsRowGenerator(movements);
    for (const row of rowGenerator) {
    tbody.appendChild(row);
 
 }
 const balanceusu = document.querySelector(".infobalance");
 
 if (movements.length>0){
      balanceusu.innerHTML = `<p id="saldo" >Balance:     ${movements[movements.length-1].balance} €</p>`;
  }else{
    balanceusu.innerHTML = `<p id="saldo">Balance: ${sessionStorage.getItem("account._beginBalance") || 0} €</p>`;

}
 }
 
/*
 * Aqui hacemos las constantes relacionando con el DOM 
 */
const btnMostrarDepo = document.getElementById("deposit");
const formDepo = document.getElementById("formDeposit");
const btnMostrarTake = document.getElementById("take");
const formTake = document.getElementById("formTake");
const errorTake= document.getElementById("error_password_2");
btnMostrarDepo.addEventListener("click", () => {
    // Mostrar o no mostrar según boton

    formDepo.style.display = "block"; 
     formTake.style.display = "none"; 
    
     });
     
     btnMostrarTake.addEventListener("click", () => {
    // Mostrar o no mostrar según boton
    formTake.style.display = "block"; 
    formDepo.style.display = "none"; 

     });
// Llamar a la funcion de crear la tabla al cargar la pagina 
    buildMovementsTable();



/*
 * Funcion para hacer ingresos
 */
async function createDepositMovement(event) {
    event.preventDefault();

    try {
        const timestamp = new Date().toISOString();
      
        const valor =document.getElementById("totaldepo").value;
  if (movements.length>0){
      oldbalance=parseFloat(movements[movements.length - 1].balance);
  }else{
      oldbalance=0;
  }
   const regexDineroComplejo = /^\d{1,3}(\.?\d{3})*([,.]\d{1,2})?$/;
        if (!regexDineroComplejo.test(valor)) {
            throw new Error("Formato no válido. Use: 1.000,00 o 1000,00 o 1000.00");
        }
        let valorLimpio = valor.replace(/\./g, "").replace(",", ".");
        
        const amount=parseFloat(valorLimpio);
        
        if (amount<=0) throw new Error("Amount must be a possitive number");

        const balance = amount + oldbalance;
        const description = "Deposit";

      

        // Construimos el XML
        const xmlBody =
            `<movement>
                <timestamp>${timestamp}</timestamp>
                <amount>${amount}</amount>
                <balance>${balance}</balance>
                <description>${description}</description>
            </movement>`;

        const response = await fetch(SERVICE_URL + `${idaccount}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/xml"
            },
            body: xmlBody
        });
        formDepo.style.display = "none"; 
        if (!response.ok) throw new Error("Error in response");

        buildMovementsTable();

    } catch (error) {
        alert("Error: " + error.message);
         formDepo.style.display = "block"; 
    }
    
    
     
    
}

/*
 * funcion para hacer retiros 
 */
async function createTakeMovement(event) {
    event.preventDefault();
    const accounttake= await cargarCuenta();

    try {
             // Contamos con el tipo de cuenta al hacer retiro ya que varia la cantidad que se pueda retirar si es Standard o Credit

        if(accounttake._type==="STANDARD"){
        
        const timestamp = new Date().toISOString();
        const amount = parseFloat(document.getElementById("totaltake").value);
        const oldbalance = parseFloat(movements[movements.length-1].balance);
        const balance = oldbalance - amount;
        const description = "Take";
        if (isNaN(amount)) throw new Error("Amount must be a number");
        if (amount<=0) throw new Error("Amount must be a possitive number");
       if (oldbalance<amount) throw new Error ("the amount exceeds the balance");
        // Construimos el XML
        const xmlBody =
            `<movement>
                <timestamp>${timestamp}</timestamp>
                <amount>${amount}</amount>
                <balance>${balance}</balance>
                <description>${description}</description>
            </movement>`;
         
        const response = await fetch(SERVICE_URL + `${idaccount}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/xml"
            },
            body: xmlBody
        });
        
         formTake.style.display = "none"; 

        if (!response.ok) throw new Error("Error in response");

        buildMovementsTable();


     // Contamos con el tipo de cuenta al hacer retiro ya que varia la cantidad que se pueda retirar si es Standard o Credit
    }if(accounttake._type==="CREDIT"){
        const timestamp = new Date().toISOString();
        const amount = parseFloat(document.getElementById("totaltake").value);
        const oldbalance = parseFloat(movements[movements.length-1].balance);
        let balance = oldbalance - amount;
        const description = "Take";
        
        const creditxbalance=oldbalance+parseFloat(accounttake._creditLine);
        if (isNaN(amount)) throw new Error("Amount must be a number");
        if (amount<=0) throw new Error("Amount must be a possitive number");
        if (creditxbalance<amount) throw new Error ("the amount exceeds the balance and credit");
       
        const xmlBody =
            `<movement>
                <timestamp>${timestamp}</timestamp>
                <amount>${amount}</amount>
                <balance>${balance}</balance>
                <description>${description}</description>
            </movement>`;

        const response = await fetch(SERVICE_URL + `${idaccount}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/xml"
            },
            body: xmlBody
        });
         formTake.style.display = "none"; 

        if (!response.ok) throw new Error("Error in response");

        buildMovementsTable();

        
        
    }
    
    }
        
            
        catch (error) {
        alert("Error: " + error.message);
        formTake.style.display = "block"; 
    }

}


/*
 * funcion showCredit para mostrar el credito si la cuenta es Credit
 */
async function showCredit(){
   
    const accountcredit= await cargarCuenta();
    const showcredit=document.querySelector(".credito");
    if(accountcredit._type==="CREDIT"){
        showcredit.textContent="Credit Line " +formateadorEU.format(accountcredit._creditLine);
        
    }else{
        showcredit.style.display="none";
    }
  
}

showCredit();


// función para hacer el update con un fetch PUT ya que el delete por si solo no actualiza la base de datos 

async function putAccount() {
    // 1. Pedimos la cuenta al servidor en XML
    const response = await fetch(
        `http://localhost:8080/CRUDBankServerSide/webresources/account/${idaccount}`,
        {
            method: "GET",
            headers: { "Accept": "application/xml" }
        }
    );
     //Aqui devuleve la respuesta del get en formato texto
    let xmlText = await response.text();

    //  ParseaR el XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    // Actualizar con el balance del  último movimiento (esto deberia de dart el ultimo movimiento despues de borrarlo)
    const newBalance = Number(movements[movements.length - 1].balance);
    xmlDoc.getElementsByTagName("balance")[0].textContent = newBalance;

    // Serializar de nuevo el XML completo pasar de txt a xml para mandarlo en el put
    const serializer = new XMLSerializer();
    const updatedXML = serializer.serializeToString(xmlDoc);

    // Hago el PUT con TODO el XML de <account>
    await fetch(`http://localhost:8080/CRUDBankServerSide/webresources/account`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/xml",
            "Accept": "application/xml"
        },
        body: updatedXML
    });
    }
    /*
    
 async function putAccount() {
    try {
        // 1. Obtenemos la cuenta actualizada del servidor (RA7-c)
        const response = await fetch(`http://localhost:8080/CRUDBankServerSide/webresources/account/${idaccount}`, {
            method: "GET",
            headers: { "Accept": "application/json" } // Pedimos JSON
        });

        if (!response.ok) throw new Error("Error al recuperar la cuenta");

        // 2. Parseamos a objeto JS (RA2-d)
        const accountData = await response.json();

        // 3. Actualizamos el balance (RA4-d: Manejo de colecciones)
        // Tomamos el balance del último movimiento de nuestra colección
        if (movements && movements.length > 0) {
            accountData.balance = movements[movements.length - 1].balance;
        }

        // 4. Enviamos la actualización (RA7-f: Uso de formato JSON)
        const putResponse = await fetch(`http://localhost:8080/CRUDBankServerSide/webresources/account`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(accountData) // Serialización JSON
        });

        if (putResponse.ok) {
            console.log("Cuenta actualizada correctamente vía JSON");
        }

    } catch (error) {
        // RA3-h: Depuración y gestión de errores
        console.error("Fallo en la sincronización:", error.message);
    }
}*/