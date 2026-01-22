/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


const SERVICE_URL = "http://localhost:8080/CRUDBankServerSide/webresources/movement/";
let movements;
const accountid="account/2654785441";
const idaccount="2654785441";
/**
 * Generator function that yields table rows
 */


 const sesionusu = document.querySelector(".infousu");
 

sesionusu.innerHTML = `<p> Usuario: ${sessionStorage.getItem("customer.firstName")} ${sessionStorage.getItem("customer.lastName")} </p>`;


// funcion para generar tablas 
function* movementsRowGenerator(movements) {
    for (const movement of movements) {
           const tr = document.createElement("tr");
           //solo los campos que queremos ver
           ["timestamp","description","amount","balance"].forEach(field => {
                const td = document.createElement("td");
                td.textContent = movement[field];
                tr.appendChild(td);
        });
     yield tr;
 }
 }
 
 // funcion fetch para recuperar datos del servidor parseando a XML
    async function fetchMovements() {
        const response = await fetch(SERVICE_URL +`${accountid}`, {
            method: "GET",
            headers: {
                "Accept": "application/xml"
              }
         });
        const xmlText = await response.text();
        return parseMovementsXML(xmlText);
    }
    
    //funcion fetch con la ruta del movmiento a elimnar,pasando como parametro el id al llamar a la funcion
    async function fetchMovementsForRemove(deleteid) {
           const response = await fetch(SERVICE_URL + `${deleteid}`, {
            // metodo DELETE para eliminar del servidor y asi mismo de la base de datos
            method: "DELETE",
            headers: {
                "Accept": "application/xml"
              }
         });
       
         
        buildMovementsTable(); 
      
    }



// funcion de Parseo de los datos XML
    function parseMovementsXML(xmlText) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");
        const movements = [];
        const movementsNodes = xmlDoc.getElementsByTagName("movement");
            for (const movementNode of movementsNodes) {
                movements.push({
                  
                    timestamp: movementNode.getElementsByTagName("timestamp")[0].textContent,
                    description:movementNode.getElementsByTagName("description")[0].textContent,
                    amount: movementNode.getElementsByTagName("amount")[0].textContent,
                    balance: movementNode.getElementsByTagName("balance")[0].textContent,
                    id:movementNode.getElementsByTagName("id")[0].textContent
                    
                    
                });
             }
        return movements;
     }
     
     
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
 

balanceusu.innerHTML = `<p id="saldo" >Saldo: ${movements[movements.length-1].balance} €</p>`;
}


//funcion accionadora del boton para eliminar el ultimo movimiento
 function deleteLast(event){   
     
     // creamos la variable en la que guardaremos el id del ultimo movimiento ya que estan ordenados
     const lastoperation=movements[movements.length-1].id;
     //llamamos tanto a la funcion fetch de eliminar como al constuir la tabla para que se haga dinamicamente(todavia queda corregir)
     fetchMovementsForRemove(lastoperation);
          
 
}
   

function confirmDelete(event){
    if (confirm("¿Estás seguro de que deseas borrar este movimiento?")) {
        // Si se pulsa si
    deleteLast();
} else {
    // Si se pulsa que no 
    console.log("Operación cancelada");
}
}

async function fetchMovementtodeposit(){
    const response = await fetch(SERVICE_URL +`${accountid}`, {
            method: "POST",
            headers: {
                "Accept": "application/xml"
              }
         });
        const xmlText = await response.text();
        return parseMovementsXML(xmlText);
    }


/*function createMovementXML() {
    const data = {
        firstName: nombreInput.value.trim()
       
    };
    }*/


   //Formularios de movimientos;
   
   //validar campo cantidad 
   
   const regexCantidad=/^\d+\.\d{2}$/;

   function validarCantidad(valor){
       return regexCantidad.test(valor); 
   }
   

const btnMostrarDepo = document.getElementById("deposit");
const formDepo = document.getElementById("formDeposit");
const btnMostrarTake = document.getElementById("take");
const formTake = document.getElementById("formTake");
const errorTake= document.getElementById("error_password_2");
btnMostrarDepo.addEventListener("click", () => {
    // Mostrar 
    formDepo.style.display = "block"; 
     formTake.style.display = "none"; 
    
     });
     
     btnMostrarTake.addEventListener("click", () => {
    // Mostrar 
    formTake.style.display = "block"; 
    formDepo.style.display = "none"; 

     });
// Call on page load
    buildMovementsTable();
    
    /*formTake.addEventListener("submit", (e) => {
        
    const valor = document.getElementById("totaltake").value;
    
    if (!validarCantidad(valor)) {
        e.preventDefault();
    errorTake.innerHTML="Error en la cantidad ,Deben ser digitos con dos decimales";
    errorTake.style.color="red";
    return;
  }
});*/



async function createDepositMovement(event) {
    event.preventDefault();

    try {
        const timestamp = new Date().toISOString();
        const amount = parseFloat(document.getElementById("totaldepo").value);
        const oldbalance = parseFloat(movements[movements.length-1].balance);
        const balance = amount + oldbalance;
        const description = "Deposit";

        if (isNaN(amount)) throw new Error("Amount must be a number");

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

        if (!response.ok) throw new Error("Error in response");

        buildMovementsTable();

    } catch (error) {
        alert("Error: " + error.message);
    }
    
    putAccount();
}

async function createTakeMovement(event) {
    event.preventDefault();

    try {
        const timestamp = new Date().toISOString();
        const amount = parseFloat(document.getElementById("totaltake").value);
        const oldbalance = parseFloat(movements[movements.length-1].balance);
        const balance = oldbalance - amount;
        const description = "Take";
        if (isNaN(amount)) throw new Error("Amount must be a number");

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

        if (!response.ok) throw new Error("Error in response");

        buildMovementsTable();

    } catch (error) {
        alert("Error: " + error.message);
    }
    
    putAccount();
}


async function cargarCuenta(accountID) {
    const response = await fetch(
        `http://localhost:8080/CRUDBankServerSide/websources/account/${accountID}`,
        {
            method: "GET",
            headers: { "Accept": "application/xml" }
        }
    );

    const xmlText = await response.text();
 
    

    // Convertir XML → objeto Account
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");

    const account = new Account(
        xml.getElementsByTagName("id")[0].textContent,
        xml.getElementsByTagName("description")[0].textContent,
        xml.getElementsByTagName("balance")[0].textContent,
        xml.getElementsByTagName("creditLine")[0].textContent,
        xml.getElementsByTagName("beginBalance")[0].textContent,
        xml.getElementsByTagName("beginBalanceTimestamp")[0].textContent,
        xml.getElementsByTagName("type")[0].textContent
    );

    return account;
}


async function putAccount(){
    const account = await cargarCuenta(idaccount);
    
    const accountXML = `
<account>
    <id>${account.getId()}</id>
    <description>${account.getDescription()}</description>
    <balance>${parseFloat(movements[movements.length-1].balance)}</balance>
    <creditLine>${account.getCreditLine()}</creditLine>
    <beginBalance>${account.getBeginBalance()}</beginBalance>
    <beginBalanceTimestamp>${account.getBeginBalanceTimestamp()}</beginBalanceTimestamp>
    <type>${account.getType()}</type>
</account>
`.trim();

    fetch(`http://localhost:8080/CRUDBankServerSide/websources/account`,{
        
        method: "PUT",
        headers: {
            "Content-type":"application/xml",
            "Accept":"application/xml"
            
        },
        body: accountXML
    });
}

   
