import { BasicStrategy } from "passport-http";
import {OValidUsers} from "../types/OValidUsers.ts";

const validUsers: OValidUsers = {
    'admin': 'admin',
    'user': 'user',
    'admin2': 'admin2'
};

export const passportStrategy = new BasicStrategy((username, password, done) => {
    if (validUsers[username] === password) {
        return done(null, { id: username });
    }

    return done(null, false);
});