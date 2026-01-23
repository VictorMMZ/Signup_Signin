class Account {
    constructor(id, description, balance, creditLine, beginBalance, beginBalanceTimestamp, type) {
        this.id = id;
        this.description = description;
        // Forzamos decimales para que sea tipo REAL
        this.balance = parseFloat(balance);
        this.creditLine = parseFloat(creditLine);
        this.beginBalance = parseFloat(beginBalance);
        this.beginBalanceTimestamp = beginBalanceTimestamp; 
        this.type = type; // 0: Standard, 1: Credit
    }

    // Métodos para obtener los datos formateados
    getBalanceFormatted() {
        return this.balance.toFixed(2) + " €";
    }

    getCreditLineFormatted() {
        return this.creditLine.toFixed(2) + " €";
    }
}

class Movements {
    constructor(id, timestamp, amount, balance, description) {
        this.id = id;
        this.timestamp = timestamp;
        this.amount = parseFloat(amount);
        this.balance = parseFloat(balance);
        this.description = description;
    }
}