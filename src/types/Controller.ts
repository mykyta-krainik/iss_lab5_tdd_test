import {IFinancialRecord} from "../models/IFinancialRecord.ts";

export interface Controller {
    getAll: (username: string) => IFinancialRecord[];
    getOne: (username: string, id: number) => IFinancialRecord | undefined;
    create: (username: string, recordData: Omit<IFinancialRecord, "id">) => IFinancialRecord;
    update: (username: string, id: number, recordData: Partial<Omit<IFinancialRecord, "id">>) => IFinancialRecord;
    delete: (username: string, id: number) => IFinancialRecord;
}