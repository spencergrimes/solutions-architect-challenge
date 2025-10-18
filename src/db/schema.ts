import Database from 'better-sqlite3';

export function initializeDatabase() {
    const dbName = process.env.DB_NAME || 'cartoncaps.db';
    const db = new Database(dbName);
    // create the users table
    // id is a UUID, needs to be geneated in application code
    // authToken is a random string of 32 characters, needs to be geneated in application code
    // NOTE: in real life we would not be storing an authToken in the user table. this is just for simplicity of testing.
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            authToken TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE, 
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            birthday DATE NOT NULL,
            referralCode TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    // create the referrals table
    db.exec(`
        CREATE TABLE IF NOT EXISTS referrals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            referralCode TEXT NOT NULL,
            referringUserId TEXT NOT NULL,
            referredUserId TEXT,
            deviceIdentifier TEXT,
            deepLink TEXT,
            channel TEXT NOT NULL,
            status TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    return db;
}