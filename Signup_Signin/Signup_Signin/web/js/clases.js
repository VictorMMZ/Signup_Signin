/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 * 
 * Autor:Victor Marrero 
 * Date:11/01/2026
 */

//Vamos a crear las clases que utilizaremos para esta segunda practica CRUD

class Account{
    #id
    #description
    #balance
    #creditLine
    #beginBalance
    #beginBalanceTimestamp
    #type
    
    
    constructor(id,description,balance,creditLine,beginBalance,beginBalanceTimestamp,type){
        this.#id = id;
        this.#description = description;
        this.#balance = balance;
        this.#creditLine = creditLine;
        this.#beginBalance = beginBalance;
        this.#beginBalanceTimestamp = beginBalanceTimestamp;
        this.#type = type;
    }
    
    getId() {
        return this.#id ;
    }
    
    getDescription() {
        return this.#description;
    } 
    getBalance() {
        return this.#balance ;
    }
    getCreditLine() { 
        return this.#creditLine ;
    }
    getBeginBalance() {
        return this.#beginBalance ;
    } 
    getBeginBalanceTimestamp() {
        return this.#beginBalanceTimestamp ;
    }
    getType() { return this.#type ;
    }
    
}

class Movements{
    
     #id;
     #timestamp;
     #amount;
     #balance;
     #description;
     
    constructor(id, timestamp, amount, balance, description) {
        this.#id = id; 
        this.#timestamp = timestamp; 
        this.#amount = amount;
        this.#balance = balance; 
        this.#description = description; }
    
    // --- GETTERS ---
     get id() {
         return this.#id; 
     }
     get timestamp() {
         return this.#timestamp; 
     }
     get amount() {
         return this.#amount; 
     }
     get balance() {
         return this.#balance;
     }
     get description() {
         return this.#description; 
     }
    
    
}

