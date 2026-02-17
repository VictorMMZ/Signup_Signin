/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 * 
 * Autor:Victor Marrero 
 * Date:11/01/2026
 */

//Vamos a crear las clases que utilizaremos para esta segunda practica CRUD

class Account{
    _id
    _description
    _balance
    _creditLine
    _beginBalance
    _beginBalanceTimestamp
    _type
    
    
    constructor(id,description,balance,creditLine,beginBalance,beginBalanceTimestamp,type){
        this._id = id;
        this._description = description;
        this._balance = balance;
        this._creditLine = creditLine;
        this._beginBalance = beginBalance;
        this._beginBalanceTimestamp = beginBalanceTimestamp;
        this._type = type;
    }
      // AÑADIDO: toJSON para Account
    // Esto mapea tus propiedades internas (_prop) a las que espera el servidor (prop)
    toJSON() {
        return {
            id: this._id,
            description: this._description,
            balance: this._balance,
            creditLine: this._creditLine,
            beginBalance: this._beginBalance,
            beginBalanceTimestamp: this._beginBalanceTimestamp,
            type: this._type
        };
    }

    getId() { return this._id; }
    getDescription() { return this._description; }
    getBalance() { return this._balance; }
    getCreditLine() { return this._creditLine; }
    getBeginBalance() { return this._beginBalance; }
    getBeginBalanceTimestamp() { return this._beginBalanceTimestamp; }
    getType() { return this._type; }
}
/**
 * 
 * @type {type}
 * @todo Cambiar el nombre de la clase de Movements a Movement y quitar el _ del nombre de los atributos
 */

//Clase Movement renombrada
class Movement{
    // atributos sin guión bajo ,vi que en esta version se utilizaban guines bajos como señal de privacidad por eso estaban puestos, no me dejaba poner #.
     id;
     timestamp;
     amount;
     balance;
     description;
     
    constructor(timestamp, amount, balance, description) {
        
        this.timestamp = timestamp; 
        this.amount = amount;
        this.balance = balance; 
        this.description = description; }
    
    // --- GETTERS ---
     get id() {
         return this.id; 
     }
     get timestamp() {
         return this.timestamp; 
     }
     get amount() {
         return this.amount; 
     }
     get balance() {
         return this.balance;
     }
     get description() {
         return this.description; 
     }
     
    toJSON() {
    return {
        id: this.id,
        timestamp: this.timestamp,
        amount:this.amount,
        balance:this.balance,
        description:this.description
    };
}


// al tener yo XML en vez de Json para utilizar el objeto y convertirlo en XML construyo el cuerpo como un metodo 
    toXML() {
        return `
            <movement>
                <timestamp>${this.timestamp}</timestamp>
                <amount>${this.amount}</amount>
                <balance>${this.balance}</balance>
                <description>${this.description}</description>
            </movement>
        `;
    }
}






    
