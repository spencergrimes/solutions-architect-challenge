export interface Referral {
    id: number; // primary key for the referral record
    referralCode: string;
    referringUserId: string; // user.id of the user who created the refferal
    referredUserId?: string; // user.id of the user who fullfilled this referral
    deviceIdentifier?: string;
    deepLink?: string; // the deep link to the referral action in-app
    channel: 'email' | 'sms' | 'other';
    status: 'pending' | 'completed' | 'expired';
    createdAt: Date;
    updatedAt: Date;
}

export type InsertReferral = Omit<Referral, 'id' | 'createdAt' | 'updatedAt'>;

export interface User {
    id: string; // primary key for the user record, probably a UUID
    email: string; // not in the provided user spec, but assumed to be a login detail at some point
    authToken: string; // THIS IS NOT HOW WE WOULD STORE AUTH, but for mocking the auth process in a simple way, we're using this in the DB
    firstName: string;
    lastName: string;
    birthday: string; // YYYY-MM-DD format
    referralCode: string;
    createdAt: Date;
    updatedAt: Date;
}

export type InsertUser = Omit<User, 'authToken' |'id' | 'createdAt' | 'updatedAt'>;