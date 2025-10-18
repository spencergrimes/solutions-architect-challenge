import { db } from "../db";
import { User } from "../types/referral.types";

export const getUserById = (id: string): User | undefined => {
    return db.user.findOne({ id });
}