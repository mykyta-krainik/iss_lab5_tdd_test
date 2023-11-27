import { FinancialRecordType } from "../enums/FinancialRecordType.ts";
import { FinancialRecordCategory } from "../types/FinancialRecordCategory.ts";
import { FinancialRecordIncomeCategory } from "../enums/FinancialRecordIncomeCategory.ts";
import { FinancialRecordExpenseCategory } from "../enums/FinancialRecordExpenseCategory.ts";
import {IFinancialRecord} from "../models/IFinancialRecord.ts";
import {Controller} from "../types/Controller.ts";
import {recordsById} from "../store.ts";

const financialRecordTypeToCategoryMap = {
    [FinancialRecordType.EXPENSE]: FinancialRecordExpenseCategory,
    [FinancialRecordType.INCOME]: FinancialRecordIncomeCategory
}

export class FinancialRecord implements IFinancialRecord {
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

class FinancialRecordController implements Controller {
    getAll(username: string): IFinancialRecord[] {
        return recordsById[username].map(record => record.getRecord());
    }

    getOne(username: string, id: number): IFinancialRecord | undefined {
        return recordsById[username].find(record => record.id === id)?.getRecord();
    }

    create(username: string, recordData: Omit<IFinancialRecord, "id">): IFinancialRecord {
        const record = new FinancialRecord(recordData.type, recordData.category, recordData.amount, recordData.date);

        recordsById[username].push(record);

        return record.getRecord();
    }

    update(username: string, id: number, recordData: Partial<Omit<IFinancialRecord, "id">>): IFinancialRecord {
        const record = recordsById[username].find(record => record.id === id);

        if (!record) {
            throw new Error("Record not found");
        }

        record.type = recordData["type"] ?? record.type;
        record.category = recordData["category"] ?? record.category;
        record.amount = recordData["amount"] ?? record.amount;
        record.date = recordData["date"] ?? record.date;

        return record.getRecord();
    }

    delete(username: string, id: number): IFinancialRecord {
        const recordIndex = recordsById[username].findIndex(record => record.id === id);

        if (recordIndex === -1) {
            throw new Error("Record not found");
        }

        const record = recordsById[username][recordIndex];

        recordsById[username].splice(recordIndex, 1);

        return record.getRecord();
    }
}

export default new FinancialRecordController();
