import { describe, test, expect, beforeEach } from "vitest";

import { User } from "../app.ts";

describe("User", () => {
    let user: User;

    beforeEach(() => {
        user = new User("John", 1000);
    });

    test("should be created", () => {
        expect(user).toBeDefined();
    });

    test("should have name", () => {
        expect(user.name).toBe("John");
    });

    test("should have current balance", () => {
        expect(user.currentBalance).toBe(1000);
    });

    test("should be able to change name", () => {
        user.name = "Jane";

        expect(user.name).toBe("Jane");
    });

    test("should not be able to change name to empty string", () => {
        expect(() => {
            user.name = "";
        }).toThrow();
    });

    test("should be able to adjust balance", () => {
        user.adjustBalance(500);
        expect(user.currentBalance).toBe(500);
    });

    test("should not be able to adjust balance to negative amount", () => {
        expect(() => {
            user.adjustBalance(-500);
        }).toThrow();
    });

    test("should not be able to adjust balance to zero amount", () => {
        expect(() => {
            user.adjustBalance(0);
        }).toThrow();
    });

    test("should not be able to adjust balance to non-integer amount", () => {
        expect(() => {
            user.adjustBalance(0.5);
        }).toThrow();
    });

    test("should be able to withdraw", () => {
        user.withdraw(500);
        expect(user.currentBalance).toBe(500);
    });

    test("should be able to deposit", () => {
        user.deposit(500);
        expect(user.currentBalance).toBe(1500);
    });

    test("should not be able to withdraw more than current balance", () => {
        expect(() => {
            user.withdraw(1500);
        }).toThrow();
    });

    test("should not be able to withdraw negative amount", () => {
        expect(() => {
            user.withdraw(-500);
        }).toThrow();
    });

    test("should not be able to deposit negative amount", () => {
        expect(() => {
            user.deposit(-500);
        }).toThrow();
    });

    test("should not be able to deposit zero amount", () => {
        expect(() => {
            user.deposit(0);
        }).toThrow();
    });

    test("should not be able to withdraw zero amount", () => {
        expect(() => {
            user.withdraw(0);
        }).toThrow();
    });

    test("should not be able to withdraw non-integer amount", () => {
        expect(() => {
            user.withdraw(0.5);
        }).toThrow();
    });

    test("should not be able to deposit non-integer amount", () => {
        expect(() => {
            user.deposit(0.5);
        }).toThrow();
    });
});
