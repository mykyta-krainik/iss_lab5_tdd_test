import request from 'supertest';
import { describe, test, expect } from "vitest";
import { app } from '../app.ts';

describe("Records API", () => {
    test("GET /records: should be able to get all the user's records if logged in", async () => {
        const response = await request(app).get("/records").auth("admin", "admin");

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    test("GET /records: should not be able to get any records if not logged in", async () => {
        const response = await request(app).get("/records");

        expect(response.status).toBe(401);
    });

    test("GET /records/:id: should be able to get a record if logged in", async () => {
        const date = new Date();

        const responseAdd = await request(app).post("/records").auth("admin", "admin").send({ type: "EXPENSE", category: "FOOD", amount: 100, date });
        const record = responseAdd.body;

        const response = await request(app).get(`/records/${record.id}`).auth("admin", "admin");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: record.id, type: "EXPENSE", category: "FOOD", amount: 100, date: date.toJSON() });
    });

    test("GET /records/:id: should not be able to get a record if not logged in", async () => {
        const response = await request(app).get("/records/1");

        expect(response.status).toBe(401);
    });

    test("POST /records: should be able to add a record if logged in", async () => {
        const date = new Date();

        const response = await request(app).post("/records").auth("admin", "admin").send({ type: "EXPENSE", category: "FOOD", amount: 100, date: date });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: response.body.id, type: "EXPENSE", category: "FOOD", amount: 100, date: date.toJSON() });
    });

    test("POST /records: should not be able to add a record if not logged in", async () => {
        const response = await request(app).post("/records").send({ type: "EXPENSE", category: "FOOD", amount: 100, date: new Date() });

        expect(response.status).toBe(401);
    });

    test("PUT /records/:id: should be able to update a record if logged in", async () => {
        const date = new Date();

        const responseAdd = await request(app).post("/records").auth("admin", "admin").send({ type: "EXPENSE", category: "FOOD", amount: 100, date });
        const record = responseAdd.body;

        const response = await request(app).put(`/records/${record.id}`).auth("admin", "admin").send({ amount: 10000 });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: record.id, type: "EXPENSE", category: "FOOD", amount: 10000, date: date.toJSON() });
    });

    test("PUT /records/:id: should not be able to update a record if not logged in", async () => {
        const date = new Date();

        const responseAdd = await request(app).post("/records").auth("admin", "admin").send({ type: "EXPENSE", category: "FOOD", amount: 100, date });
        const record = responseAdd.body;

        const response = await request(app).put(`/records/${record.id}`).send({ amount: 200 });

        expect(response.status).toBe(401);
    });

    test("DELETE /records/:id: should be able to delete a record if logged in", async () => {
        const date = new Date();

        const responseAdd = await request(app).post("/records").auth("admin", "admin").send({ type: "EXPENSE", category: "FOOD", amount: 100, date });
        const record = responseAdd.body;

        const response = await request(app).delete(`/records/${record.id}`).auth("admin", "admin");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: record.id, type: "EXPENSE", category: "FOOD", amount: 100, date: date.toJSON() });
    });

    test("DELETE /records/:id: should not be able to delete a record if not logged in", async () => {
        const date = new Date();

        const responseAdd = await request(app).post("/records").auth("admin", "admin").send({ type: "EXPENSE", category: "FOOD", amount: 100, date });
        const record = responseAdd.body;

        const response = await request(app).delete(`/records/${record.id}`);

        expect(response.status).toBe(401);
    });

    test("GET /records/:id: should not be able to get a record that does not exist if logged in", async () => {
        const response = await request(app).get("/records/2").auth("admin", "admin");

        expect(response.status).toBe(404);
    });

    test("GET /records/:id: should not be able to get a record that does not exist if not logged in", async () => {
        const response = await request(app).get("/records/2");

        expect(response.status).toBe(401);
    });

    test("PUT /records/:id: should not be able to update a record that does not exist if logged in", async () => {
        const response = await request(app).put("/records/2").auth("admin", "admin").send({ type: "EXPENSE", category: "FOOD", amount: 100, date: new Date() });

        expect(response.status).toBe(404);
    });

    test("PUT /records/:id: should not be able to update a record that does not exist if not logged in", async () => {
        const response = await request(app).put("/records/2").send({ type: "EXPENSE", category: "FOOD", amount: 100, date: new Date() });

        expect(response.status).toBe(401);
    });

    test("DELETE /records/:id: should not be able to delete a record that does not exist if logged in", async () => {
        const response = await request(app).delete("/records/2").auth("admin", "admin");

        expect(response.status).toBe(404);
    });

    test("DELETE /records/:id: should not be able to delete a record that does not exist if not logged in", async () => {
        const response = await request(app).delete("/records/2");

        expect(response.status).toBe(401);
    });
});
