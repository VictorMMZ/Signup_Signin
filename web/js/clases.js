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
    
    getId() {
        return this._id ;
    }
    
    getDescription() {
        return this._description;
    } 
    getBalance() {
        return this._balance ;
    }
    getCreditLine() { 
        return this._creditLine ;
    }
    getBeginBalance() {
        return this._beginBalance ;
    } 
    getBeginBalanceTimestamp() {
        return this._beginBalanceTimestamp ;
    }
    getType() { 
        return this._type ;
    }
    
}

class Movements{
    
     _id;
     _timestamp;
     _amount;
     _balance;
     _description;
     
    constructor(id, timestamp, amount, balance, description) {
        this._id = id; 
        this._timestamp = timestamp; 
        this._amount = amount;
        this._balance = balance; 
        this._description = description; }
    
    // --- GETTERS ---
     get id() {
         return this._id; 
     }
     get timestamp() {
         return this._timestamp; 
     }
     get amount() {
         return this._amount; 
     }
     get balance() {
         return this._balance;
     }
     get description() {
         return this._description; 
     }
     
    toJSON() {
    return {
        id: this._id,
        timestamp: this._timestamp,
        amount:this._amount,
        balance:this._balance,
        description:this._description
    };
}

    
}