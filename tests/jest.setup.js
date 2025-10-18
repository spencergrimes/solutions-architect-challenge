// environment variables
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'cartoncaps-test.db';

// import the database 
const { db } = require('../src/db');

// clean up database after all tests are run
afterAll(() => db.close());
afterEach(() => {
    // delete all data from the database between each test
    // this is to avoid data leakage between tests
    // this is simplistic approach, in a production app we'd need to support parallel testing and database cleanup
    db.referral.deleteAll();
    db.user.deleteAll();
})
