import { beforeEach, describe, expect, test } from "vitest";

import { FinancialRecord } from "../controllers/FinancialRecord.controller.ts";
import { FinancialRecordType } from "../enums/FinancialRecordType.ts";
import { FinancialRecordExpenseCategory } from "../enums/FinancialRecordExpenseCategory.ts";
import { FinancialRecordIncomeCategory } from "../enums/FinancialRecordIncomeCategory.ts";

describe("FinancialRecord", () => {
    test("should be created", () => {
        const financialRecord = new FinancialRecord(FinancialRecordType.INCOME, FinancialRecordIncomeCategory.WAGE, 1000, new Date());

        expect(financialRecord).toBeDefined();
    });

    test("should be able to change amount", () => {
        const financialRecord = new FinancialRecord(FinancialRecordType.INCOME, FinancialRecordIncomeCategory.WAGE, 1000, new Date());

        financialRecord.amount = 500;

        expect(financialRecord.amount).toBe(500);
    });

    test("should not be able to change amount to zero amount", () => {
        const financialRecord = new FinancialRecord(FinancialRecordType.INCOME, FinancialRecordIncomeCategory.WAGE, 1000, new Date());

        expect(() => {
            financialRecord.amount = 0;
        }).toThrow();
    });

    test("should not be able to change amount to negative amount", () => {
        const financialRecord = new FinancialRecord(FinancialRecordType.INCOME, FinancialRecordIncomeCategory.WAGE, 1000, new Date());

        expect(() => {
            financialRecord.amount = -500;
        }).toThrow();
    });

    test("should not be able to change amount to non-integer amount", () => {
        const financialRecord = new FinancialRecord(FinancialRecordType.INCOME, FinancialRecordIncomeCategory.WAGE, 1000, new Date());

        expect(() => {
            financialRecord.amount = 0.5;
        }).toThrow();
    });

    test("should not be able to create with the Expense category for the Income type", () => {
        expect(() => {
            new FinancialRecord(FinancialRecordType.INCOME, FinancialRecordExpenseCategory.FOOD, 1000, new Date());
        }).toThrow();
    });

    test("should not be able to create with the Income category for the Expense type", () => {
        expect(() => {
            new FinancialRecord(FinancialRecordType.EXPENSE, FinancialRecordIncomeCategory.WAGE, 1000, new Date());
        }).toThrow();
    });

    test("should not be able to create with negative amount", () => {
        expect(() => {
            new FinancialRecord(FinancialRecordType.INCOME, FinancialRecordIncomeCategory.WAGE, -1000, new Date());
        }).toThrow();
    });

    test("should not be able to create with zero amount", () => {
        expect(() => {
            new FinancialRecord(FinancialRecordType.INCOME, FinancialRecordIncomeCategory.WAGE, 0, new Date());
        }).toThrow();
    });

    test("should not be able to create with non-integer amount", () => {
        expect(() => {
            new FinancialRecord(FinancialRecordType.INCOME, FinancialRecordIncomeCategory.WAGE, 0.5, new Date());
        }).toThrow();
    });

    test("should not be able to create with empty date", () => {
        expect(() => {
            new FinancialRecord(FinancialRecordType.INCOME, FinancialRecordIncomeCategory.WAGE, 1000, new Date(""));
        }).toThrow();
    });

    test("should not be able to create with invalid date", () => {
        expect(() => {
            new FinancialRecord(FinancialRecordType.INCOME, FinancialRecordIncomeCategory.WAGE, 1000, new Date("invalid"));
        }).toThrow();
    });

    describe("FinancialRecord - income", () => {
        let financialRecord: FinancialRecord;

        beforeEach(() => {
            financialRecord = new FinancialRecord(FinancialRecordType.INCOME, FinancialRecordIncomeCategory.WAGE, 1000, new Date());
        });

        test("should have type", () => {
            expect(financialRecord.type).toBe(FinancialRecordType.INCOME);
        });

        test("should have category", () => {
            expect(financialRecord.category).toBe(FinancialRecordIncomeCategory.WAGE);
        });

        test("should have amount", () => {
            expect(financialRecord.amount).toBe(1000);
        });

        test("should have date", () => {
            expect(financialRecord.date).toBeDefined();
        });

        test("should be able to change type", () => {
            financialRecord.type = FinancialRecordType.EXPENSE;

            expect(financialRecord.type).toBe(FinancialRecordType.EXPENSE);
        });

        test("should be able to change category", () => {
            financialRecord.category = FinancialRecordIncomeCategory.OTHERS_I;

            expect(financialRecord.category).toBe(FinancialRecordIncomeCategory.OTHERS_I);
        });

        test("should be able to change date", () => {
            const date = new Date();

            financialRecord.date = date;

            expect(financialRecord.date).toBe(date);
        });

        test("should not be able to change category to one that does not correspond to type", () => {
            expect(() => {
                financialRecord.category = FinancialRecordExpenseCategory.ENTERTAINMENT;
            }).toThrow();
        });

        test("should not be able to change date to empty date", () => {
            expect(() => {
                financialRecord.date = new Date("");
            }).toThrow();
        });

        test("should not be able to change date to invalid date", () => {
            expect(() => {
                financialRecord.date = new Date("invalid");
            }).toThrow();
        });
    });

    describe("FinancialRecord - expense", () => {
        let financialRecord: FinancialRecord;

        beforeEach(() => {
            financialRecord = new FinancialRecord(FinancialRecordType.EXPENSE, FinancialRecordExpenseCategory.FOOD, 1000, new Date());
        });

        test("should have type", () => {
            expect(financialRecord.type).toBe(FinancialRecordType.EXPENSE);
        });

        test("should have category", () => {
            expect(financialRecord.category).toBe(FinancialRecordExpenseCategory.FOOD);
        });

        test("should have amount", () => {
            expect(financialRecord.amount).toBe(1000);
        });

        test("should have date", () => {
            expect(financialRecord.date).toBeDefined();
        });

        test("should be able to change type", () => {
            financialRecord.type = FinancialRecordType.INCOME;

            expect(financialRecord.type).toBe(FinancialRecordType.INCOME);
        });

        test("should be able to change category", () => {
            financialRecord.category = FinancialRecordExpenseCategory.TRANSPORTATION;

            expect(financialRecord.category).toBe(FinancialRecordExpenseCategory.TRANSPORTATION);
        });

        test("should be able to change amount", () => {
            financialRecord.amount = 500;

            expect(financialRecord.amount).toBe(500);
        });

        test("should be able to change date", () => {
            const date = new Date();

            financialRecord.date = date;

            expect(financialRecord.date).toBe(date);
        });


        test("should not be able to change category to one that does not correspond to type", () => {
            expect(() => {
                financialRecord.category = FinancialRecordIncomeCategory.OTHERS_I;
            }).toThrow();
        });

        test("should not be able to change amount to zero amount", () => {
            expect(() => {
                financialRecord.amount = 0;
            }).toThrow();
        });

        test("should not be able to change amount to non-integer amount", () => {
            expect(() => {
                financialRecord.amount = 0.5;
            }).toThrow();
        });

        test("should not be able to change date to empty date", () => {
            expect(() => {
                financialRecord.date = new Date("");
            }).toThrow();
        });

        test("should not be able to change date to invalid date", () => {
            expect(() => {
                financialRecord.date = new Date("invalid");
            }).toThrow();
        });
    });
});