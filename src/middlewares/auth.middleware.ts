import passport from "passport";

export const authMiddleware = passport.authenticate('basic', { session: false });