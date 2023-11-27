import { FinancialRecordType } from "../enums/FinancialRecordType.ts";
import { FinancialRecordCategory } from "../types/FinancialRecordCategory.ts";

export interface IFinancialRecord {
    id: number;
    type: FinancialRecordType;
    category: FinancialRecordCategory;
    amount: number;
    date: Date;
}