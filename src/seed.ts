import { initializeDatabase } from './db/schema';

const db = initializeDatabase();

export default function seed() {
    // delete all existing data from the database
    db.exec(`
        DELETE FROM users;
        DELETE FROM referrals;
    `);
    ///////////////////////////////
    // insert test users
    ///////////////////////////////
    const users = [{
        id: 'ae05e288f60d421a',
        email: 'test123@example.com',
        authToken: 'test-token-123',
        firstName: 'Ron',
        lastName: 'Weasley',
        birthday: '1980-01-01',
        referralCode: 'ABC123',
    }, {
        id: '9b65685504a33690',
        email: 'hermonine@example.com',
        firstName: 'Hermonie',
        authToken: 'test-token-456',
        lastName: 'Granger',
        birthday: '1985-05-01',
        referralCode: 'DEF456',
    }]
    console.log('Inserting test users', users);
    const userStatement = db.prepare('INSERT INTO users (id, authToken,email, firstName, lastName, birthday, referralCode) VALUES (?,?,?, ?, ?, ?, ?)');
    for (const user of users) {
        userStatement.run(user.id, user.authToken, user.email, user.firstName, user.lastName, user.birthday, user.referralCode);
    }

    ///////////////////////////////
    // insert test data
    ///////////////////////////////
    const referrals = [{
        id: 1,
        referralCode: 'TEST123',
        referringUserId: 'abc123',
        channel: 'email',
        status: 'pending',
        deepLink: 'https://cartoncaps.link/afi7efhj90',
    }, {
        id: 2,
        referralCode: 'TEST456',
        referringUserId: 'def456',
        channel: 'sms',
        status: 'pending',
        deepLink: 'https://cartoncaps.link/bgi8fgik91',
    }, {
        id: 3,
        referralCode: 'TEST123',
        referringUserId: 'abc123',
        channel: 'other',
        status: 'completed',
        deviceIdentifier: 'f4565e38-6d6f-4141-9912-a2e8c57e237f',
        referredUserId: 'def456',
        deepLink: 'https://cartoncaps.link/cjk9hglk92',
    }]
    console.log('Inserting test referrals', JSON.stringify(referrals, null, 2));
    const referralStatement = db.prepare('INSERT INTO referrals (referralCode, referringUserId, channel, status, deepLink, deviceIdentifier, referredUserId) VALUES (?, ?, ?, ?, ?, ?, ?)');
    for (const referral of referrals) {
        referralStatement.run(referral.referralCode, referral.referringUserId, referral.channel, referral.status, referral.deepLink, referral.deviceIdentifier, referral.referredUserId);
    }

    console.log('Seeding complete');
}

// Run if called directly
if (require.main === module) {
    seed();
    db.close();
    process.exit(0);
}