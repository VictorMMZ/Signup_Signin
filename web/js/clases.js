class Account {
    constructor(id, description, balance, creditLine, beginBalance, beginBalanceTimestamp, type) {
        this.id = id;
        this.description = description;
        this.balance = parseFloat(balance) || 0;
        this.creditLine = parseFloat(creditLine) || 0;
        this.beginBalance = parseFloat(beginBalance) || 0;
        this.beginBalanceTimestamp = beginBalanceTimestamp;
        this.type = type;
    }

    toJSON() {
        return {
            id: this.id,
            description: this.description,
            balance: this.balance,
            creditLine: this.creditLine,
            beginBalance: this.beginBalance,
            beginBalanceTimestamp: this.beginBalanceTimestamp,
            // Forzamos que el type sea siempre un número entero
            type: parseInt(this.type)
        };
    }

    // Getters actualizados (sin el guion bajo)
    getId() { return this.id; }
    getDescription() { return this.description; }
    getBalance() { return this.balance; }
    getCreditLine() { return this.creditLine; }
    getBeginBalance() { return this.beginBalance; }
    getBeginBalanceTimestamp() { return this.beginBalanceTimestamp; }
    getType() { return this.type; }
}

