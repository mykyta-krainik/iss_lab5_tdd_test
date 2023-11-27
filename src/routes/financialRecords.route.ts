import express from "express";
import financialRecordController from "../controllers/FinancialRecord.controller.ts";
import {authMiddleware} from "../middlewares/auth.middleware.ts";

export const financialRecordRouter =  express.Router();

financialRecordRouter.get('/', authMiddleware,  (req, res) => {
    if (req.user) {
        // @ts-ignore
        const records = financialRecordController.getAll(req.user.id);

        res.json(records);

        return;
    }

    res.sendStatus(401);
});
financialRecordRouter.get('/:id', authMiddleware, (req, res) => {
    if (req.user) {
        // @ts-ignore
        const record = financialRecordController.getOne(req.user.id, parseInt(req.params.id));

        if (record) {
            res.status(200).json(record);

            return;
        }

        res.sendStatus(404);

        return;
    }

    res.sendStatus(401);
});

financialRecordRouter.post('/', authMiddleware, (req, res) => {
    if (req.user) {
        // @ts-ignore
        const record = financialRecordController.create(req.user.id, {
            type: req.body.type,
            category: req.body.category,
            amount: req.body.amount,
            date: new Date(req.body.date)
        });

        res.status(200).json(record);

        return;
    }

    res.sendStatus(401);
});

financialRecordRouter.put('/:id', authMiddleware, (req, res) => {
    if (req.user) {
        try {
            // @ts-ignore
            const record = financialRecordController.update(req.user.id, parseInt(req.params.id), {
                type: req.body.type,
                category: req.body.category,
                amount: req.body.amount,
                date: req.body.date ? new Date(req.body.date) : undefined
            });

            res.status(200).json(record);
        } catch {
            res.sendStatus(404);
        }
        return;
    }

    res.sendStatus(401);
});

financialRecordRouter.delete('/:id', authMiddleware, (req, res) => {
    if (req.user) {
        try {
            // @ts-ignore
            const record = financialRecordController.delete(req.user.id, parseInt(req.params.id));

            res.status(200).json(record);
        } catch {
            res.sendStatus(404);
        }

        return;
    }

    res.sendStatus(401);
});
