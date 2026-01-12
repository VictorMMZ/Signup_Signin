/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


const SERVICE_URL = "http://localhost:8080/CRUDBankServerSide/webresources/movement";
/**
 * Generator function that yields table rows
 */

async function prueba(event){
    
    event.preventDefault();
    event.stopPropagation();
// 1. Obtener movimientos del servidor
 const movements = await fetchMovements(); 
  // 2. Generar filas con el generador const
   tbody = document.getElementById("tbodyMovements"); 
   tbody.innerHTML = "";
   for (const row of userRowGenerator(movements)) {
       tbody.appendChild(row); 
            }
     }

function* userRowGenerator(movements) {
    for (const movement of movements) {
           const tr = document.createElement("tr");
           ["timestamp", "amount","balance"].forEach(field => {
                const td = document.createElement("td");
                td.textContent = movement[field];
                tr.appendChild(td);
        });
     yield tr;
 }
 }
 
    async function fetchMovements() {
        const response = await fetch(SERVICE_URL +"/account/2654785441", {
            method: "GET",
            headers: {
                "Accept": "application/xml"
              }
         });
        const xmlText = await response.text();
        return parseMovementsXML(xmlText);
    }

    function parseMovementsXML(xmlText) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");
        const movements = [];
        const movementsNodes = xmlDoc.getElementsByTagName("movement");
            for (const movementNode of movementsNodes) {
                movements.push({
                  
                    timestamp: movementNode.getElementsByTagName("timestamp")[0].textContent,
                    amount: movementNode.getElementsByTagName("amount")[0].textContent,
                    balance: movementNode.getElementsByTagName("balance")[0].textContent
                    
                    
                });
             }
        return movements;
     }


