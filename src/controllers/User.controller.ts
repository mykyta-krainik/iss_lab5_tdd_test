export class User {
    private _name: string = "";
    private _currentBalance: number = 0;

    constructor(name: string, currentBalance: number) {
        if (currentBalance <= 0 || !Number.isInteger(currentBalance)) {
            throw new Error("Invalid current balance");
        }

        this.name = name;
        this.currentBalance = currentBalance;
    }

    get name() {
        return this._name;
    }

    set name(name: string) {
        if (!name) {
            throw new Error("Name cannot be empty");
        }

        this._name = name;
    }

    get currentBalance() {
        return this._currentBalance;
    }

    set currentBalance(currentBalance: number) {
        this._currentBalance = currentBalance;
    }

    adjustBalance(amount: number) {
        if (!User._isAmountValid(amount)) {
            throw new Error("Invalid adjustment amount");
        }

        this.currentBalance = amount;
    }

    withdraw(amount: number) {
        if (!User._isAmountValid(amount)) {
            throw new Error("Invalid withdrawal amount");
        }

        if (amount > this.currentBalance) {
            throw new Error("Insufficient balance");
        }

        this.currentBalance -= amount;
    }

    deposit(amount: number) {
        if (!User._isAmountValid(amount)) {
            throw new Error("Invalid deposit amount");
        }

        this.currentBalance += amount;
    }

    private static _isAmountValid(amount: number) {
        return amount > 0 && Number.isInteger(amount);
    }
}
