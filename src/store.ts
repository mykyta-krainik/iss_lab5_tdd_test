import { FinancialRecord } from "./controllers/FinancialRecord.controller.ts";

export type Records = FinancialRecord[]

interface RecordsByUserId {
    [id: string]: Records
}

export const recordsById: RecordsByUserId = {
    'admin': [],
    'user': [],
    'admin2': [],
};