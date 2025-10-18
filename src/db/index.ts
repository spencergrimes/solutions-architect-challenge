import { initializeDatabase } from './schema';
import { InsertReferral, InsertUser, Referral, User } from '../types/referral.types';
import { randomUUID } from 'crypto';

const dbInstance = initializeDatabase();

// REFERRAL DB FUNCTIONS
// This is a simplified implementation of the database layer. 
// In production, I'd prefer to use a more robust DB ORM like Prisma or Drizzle
// Also a full ORM would include more robust SQL injection protection and type safety for the query parameters

const referralDb = {
    findOne: (query: Partial<Referral>) => {
        const conditions = Object.keys(query).map(key => `${key} = ?`).join(' AND ');
        const values = Object.values(query);
        const statement = dbInstance.prepare(`SELECT * FROM referrals WHERE ${conditions}`);
        return statement.get(values) as Referral | undefined;
    },
    create: (referral: InsertReferral) => {
        const statement = dbInstance.prepare('INSERT INTO referrals (referralCode, referringUserId, channel, status, deepLink) VALUES (?, ?, ?, ?, ?)');
        const result = statement.run(referral.referralCode, referral.referringUserId, referral.channel, referral.status, referral.deepLink);
        const referralDb = {
            id: result.lastInsertRowid as number,
            ...referral,
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Referral;
        return referralDb;
    },
    delete: (id: number) => {
        const statement = dbInstance.prepare('DELETE FROM referrals WHERE id = ?');
        statement.run(id);
    },
    deleteAll: () => {
        const statement = dbInstance.prepare('DELETE FROM referrals');
        statement.run();
    }
};


// USER DB FUNCTIONS
const userDb = { 
    findOne: (query: Partial<User>) => {
        const conditions = Object.keys(query).map(key => `${key} = ?`).join(' AND ');
        const values = Object.values(query);
        const statement = dbInstance.prepare(`SELECT * FROM users WHERE ${conditions}`);
        return statement.get(values) as User | undefined;
    },
    create: (user: InsertUser) => {
        const statement = dbInstance.prepare('INSERT INTO users (id, authToken, email, firstName, lastName, birthday, referralCode) VALUES (?, ?, ?, ?, ?, ?, ?)');
        const id = randomUUID().substring(0, 16); // 16 characters is enough for a UUID
        const authToken = randomUUID().substring(0, 32);
        const result = statement.run(id, authToken, user.email, user.firstName, user.lastName, user.birthday, user.referralCode);
        // get the actual user record from the database
        const userStatement = dbInstance.prepare(`SELECT * FROM users WHERE id = ?`)
        const userDb = userStatement.get(id) as User;
        if(!userDb){
            throw new Error('User creation failed');
        }
        return userDb;
    },
    delete: (id: string) => {
        const statement = dbInstance.prepare('DELETE FROM users WHERE id = ?');
        statement.run(id);
    },
    deleteAll: () => {
        const statement = dbInstance.prepare('DELETE FROM users');
        statement.run();
    }
}

export const db = {
    referral: referralDb,
    user: userDb,
    close: () => {
        dbInstance.close();
    }
}

