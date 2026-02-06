/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


const SERVICE_URL = "http://localhost:8080/CRUDBankServerSide/webresources/movement/";
let movements;
const idaccount = sessionStorage.getItem("account.id"); 
const accountid = "account/" + idaccount;

/**
 * Generator function that yields table rows
 */


const sesionusu = document.querySelector(".infousu");
sesionusu.innerHTML = `<p> ${sessionStorage.getItem("customer.firstName")} ${sessionStorage.getItem("customer.lastName")} </p>`;

const infoidaccount=document.querySelector(".idaccount");
infoidaccount.innerHTML = `<p> Account ID:  ${idaccount} </p>`;

const infoaccounttype= document.querySelector(".accounttype");

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
       
         
       await  buildMovementsTable(); 
         
       
        
      
    }
    
    //funcion accionadora del boton para eliminar el ultimo movimiento
 function deleteLast(event){   
     
     // creamos la variable en la que guardaremos el id del ultimo movimiento ya que cada movimiento tiene un numero de id mayor al anterior
     const lastoperation=movements[movements.length-1].id;
     //llamamos tanto a la funcion fetch de eliminar como al constuir la tabla para que se haga dinamicamente(todavia queda corregir)
     return fetchMovementsForRemove(lastoperation);
     
          
 
}
   

async function confirmDelete(event){
    if (confirm("¿Estás seguro de que deseas borrar este movimiento?")) {
        // Si se pulsa si
       
   await deleteLast();
   await putAccount();
       
       
} else {
    // Si se pulsa que no 
    console.log("Operación cancelada");
}
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
                
                /*const formateadorEU = new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 2 // Asegura dos decimales
                    });
            */
                const amount=movementNode.getElementsByTagName("amount")[0].textContent;
                
               // const formateamount= formateadorEU.format(amount);
                
                const balance=movementNode.getElementsByTagName("balance")[0].textContent;
                // const formatedbalance= formateadorEU.format(balance);
                
                movements.push({
                    
                    
                  
                    timestamp: formatedDate,
                    description:movementNode.getElementsByTagName("description")[0].textContent,
                    amount: Number(movementNode.getElementsByTagName("amount")[0].textContent),
                    balance: Number(movementNode.getElementsByTagName("balance")[0].textContent),
                    id:movementNode.getElementsByTagName("id")[0].textContent
                    
                    
                });
             }
        return movements;
     }
     async function cargarCuenta() {
    const response = await fetch(
        `http://localhost:8080/CRUDBankServerSide/webresources/account/${idaccount}`,
        {
            method: "GET",
            headers: { "Accept": "application/xml" }
        }
    );

    const xmlText = await response.text();
 
    

    // Convertir XML → objeto Account
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");

    account = new Account(
        xml.getElementsByTagName("id")[0].textContent,
        xml.getElementsByTagName("description")[0].textContent,
        xml.getElementsByTagName("balance")[0].textContent,
        xml.getElementsByTagName("creditLine")[0].textContent,
        xml.getElementsByTagName("beginBalance")[0].textContent,
        xml.getElementsByTagName("beginBalanceTimestamp")[0].textContent,
        xml.getElementsByTagName("type")[0].textContent
    );
    
    
   
   infoaccounttype.innerHTML=`<p> Type ${account._type}</p>`;
   

    return account;


}


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


async function createDepositMovement(event) {
    event.preventDefault();

    try {
        const timestamp = new Date().toISOString();
        const amount = parseFloat(document.getElementById("totaldepo").value);
  if (movements.length>0){
      oldbalance=parseFloat(movements[movements.length - 1].balance);
  }else{
      oldbalance=0;
  }
        const balance = amount + oldbalance;
        const description = "Deposit";

        if (isNaN(amount)) throw new Error("Amount must be a number");
         if (amount<=0) throw new Error("Amount must be a possitive number");

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

async function createTakeMovement(event) {
    event.preventDefault();
    const accounttake= await cargarCuenta();

    try {
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




async function putAccount() {
    // 1. Pedimos la cuenta al servidor en XML
    const response = await fetch(
        `http://localhost:8080/CRUDBankServerSide/webresources/account/${idaccount}`,
        {
            method: "GET",
            headers: { "Accept": "application/xml" }
        }
    );
     //aqui devuleve la respuesta del get en formato texto
    let xmlText = await response.text();

    // 2. ParseaR el XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    // 3. Actualizar con el balance del  último movimiento (esto deberia de dart el ultimo movimiento despues de borrarlo)
    const newBalance = Number(movements[movements.length - 1].balance);
    xmlDoc.getElementsByTagName("balance")[0].textContent = newBalance;

    // 4. Serializas de nuevo el XML completo pasar de txt a xml para mandarlo en el put
    const serializer = new XMLSerializer();
    const updatedXML = serializer.serializeToString(xmlDoc);

    // 5. Haces el PUT con TODO el XML de <account>
    await fetch(`http://localhost:8080/CRUDBankServerSide/webresources/account`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/xml",
            "Accept": "application/xml"
        },
        body: updatedXML
    });
    }
