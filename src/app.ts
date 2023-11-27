import express from 'express';
import passport from 'passport';
import 'dotenv/config';

import { financialRecordRouter } from "./routes/financialRecords.route.ts";
import {passportStrategy} from "./auth/passportAuth.ts";

export const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use("/records", financialRecordRouter);

passport.use(passportStrategy);

// const BASE_PORT = Number(process.env.PORT) || 3000;

// app.listen(BASE_PORT, () => {
//     console.log('Server is running');
// });
