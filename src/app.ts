import express from 'express';
import passport from 'passport';
import { BasicStrategy } from "passport-http";
import 'dotenv/config';

type Records = FinancialRecord[]

// TODO: rename to RecordsByUserId
interface RecordsById {
    [id: string]: Records
}

export enum FinancialRecordType {
    EXPENSE = "EXPENSE",
    INCOME = "INCOME"
}

export enum FinancialRecordExpenseCategory {
    FOOD = "FOOD",
    TRANSPORTATION = "TRANSPORTATION",
    ENTERTAINMENT = "ENTERTAINMENT",
    OTHERS_E = "OTHERS_E"
}

export enum FinancialRecordIncomeCategory {
    WAGE = "WAGE",
    OTHERS_I = "OTHERS_I"
}

// TODO: Extract the FinancialRecord type
// TODO: Rewrite the FinancialRecord class to the controller

const financialRecordTypeToCategoryMap = {
    [FinancialRecordType.EXPENSE]: FinancialRecordExpenseCategory,
    [FinancialRecordType.INCOME]: FinancialRecordIncomeCategory
}

type FinancialRecordCategory = FinancialRecordExpenseCategory | FinancialRecordIncomeCategory;

export class FinancialRecord {
    private _type: FinancialRecordType = FinancialRecordType.INCOME;
    private _category: FinancialRecordCategory = FinancialRecordIncomeCategory.WAGE;
    private _amount: number = 0;
    private _date: Date = new Date();
    private readonly _id: number = Date.now();

    constructor(type: FinancialRecordType, category: FinancialRecordCategory, amount: number, date: Date) {
        this.type = type;
        this.category = category;
        this.amount = amount;
        this.date = date;
    }

    get id() {
        return this._id;
    }

    get type() {
        return this._type;
    }

    set type(value: FinancialRecordType) {
        this._type = value;
    }

    get category() {
        return this._category;
    }

    set category(value: FinancialRecordCategory) {
        if (!(value in financialRecordTypeToCategoryMap[this.type])) {
            throw new Error("Invalid category");
        }

        this._category = value;
    }

    get amount(): number {
        return this._amount;
    }

    set amount(value: number) {
        if (value <= 0 || !Number.isInteger(value)) {
            throw new Error("Amount must be a positive integer");
        }

        this._amount = value;
    }

    get date(): Date {
        return this._date;
    }

    set date(value: Date) {
        if (!value || isNaN(value.getTime())) {
            throw new Error("Date must be a valid date");
        }

        this._date = value;
    }

    getRecord() {
        return {
            id: this.id,
            type: this.type,
            category: this.category,
            amount: this.amount,
            date: this.date
        };
    }
}


export class User {
    private _name: string = "";
    private _currentBalance: number = 0;

    constructor(name: string, currentBalance: number) {

        // TODO: remove redundant check
        if (!name) {
            throw new Error("Name cannot be empty");
        }

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

    // TODO: rename to adjustCurrentBalance
    // TODO: extreact check to a method to the setter
    adjustBalance(amount: number) {
        if (amount <= 0 || !Number.isInteger(amount)) {
            throw new Error("Invalid adjustment amount");
        }

        this.currentBalance = amount;
    }

    withdraw(amount: number) {
        if (amount <= 0 || !Number.isInteger(amount)) {
            throw new Error("Invalid withdrawal amount");
        }

        if (amount > this.currentBalance) {
            throw new Error("Insufficient balance");
        }

        this.currentBalance -= amount;
    }

    deposit(amount: number) {
        if (amount <= 0 || !Number.isInteger(amount)) {
            throw new Error("Invalid deposit amount");
        }

        this.currentBalance += amount;
    }
}


const recordsById: RecordsById = {
    'admin': [],
    'user': [],
    'admin2': [],
};

export const app = express();

app.use(express.json());
app.use(passport.initialize());


// TODO: extract possible values to the array
passport.use(new BasicStrategy((username, password, done) => {
    if (username === 'admin' && password === 'admin') {
        return done(null, { id: 'admin' });
    }

    if (username === 'user' && password === 'user') {
        return done(null, { id: 'user' });
    }

    if (username === 'admin2' && password === 'admin2') {
        return done(null, { id: 'admin2' });
    }

    return done(null, false);
}));

app.get('/records', passport.authenticate('basic', { session: false }),  (req, res) => {
    if (req.user) {
        // @ts-ignore
        const records = recordsById[req.user.id];

        res.json(records.map(record => record.getRecord()));

        return;
    }

    res.sendStatus(401);
});

// TODO: extract this middleware to a separate file
app.get('/records/:id', passport.authenticate('basic', { session: false }), (req, res) => {
    if (req.user) {
        // @ts-ignore
        const records = recordsById[req.user.id];
        const record = records.find(record => record.id === parseInt(req.params.id));

        if (record) {
            res.status(200).json(record.getRecord());

            return;
        }

        res.sendStatus(404);

        return;
    }

    res.sendStatus(401);
});

app.post('/records', passport.authenticate('basic', { session: false }), (req, res) => {
    if (req.user) {
        // @ts-ignore
        const records = recordsById[req.user.id];
        const record = new FinancialRecord(req.body.type, req.body.category, req.body.amount, new Date(req.body.date));

        records.push(record);

        res.status(200).json(record.getRecord());

        return;
    }

    res.sendStatus(401);
});

app.put('/records/:id', passport.authenticate('basic', { session: false }), (req, res) => {
    if (req.user) {
        // @ts-ignore
        const records = recordsById[req.user.id];
        const record = records.find(record => record.id === parseInt(req.params.id));

        if (record) {
            record.type = req.body.type ?? record.type;
            record.category = req.body.category ?? record.category
            record.amount = req.body.amount ?? record.amount
            record.date = req.body.date ? new Date(req.body.date) : record.date;

            res.status(200).json(record.getRecord());

            return;
        }

        res.sendStatus(404);

        return;
    }

    res.sendStatus(401);
});

app.delete('/records/:id', passport.authenticate('basic', { session: false }), (req, res) => {
    if (req.user) {
        // @ts-ignore
        const records = recordsById[req.user.id];
        const record = records.find(record => record.id === parseInt(req.params.id));

        if (record) {
            // TODO: use filter instead
            records.splice(records.findIndex((r) => record.id === r.id), 1);

            res.status(200).json(record.getRecord());

            return;
        }

        res.sendStatus(404);

        return;
    }

    res.sendStatus(401);
});

// const BASE_PORT = Number(process.env.PORT) || 3000;

// app.listen(BASE_PORT, () => {
//     console.log('Server is running');
// });
