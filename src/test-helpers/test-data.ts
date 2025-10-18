import { db } from '../db';
import { InsertUser } from '../types/referral.types';

// helper function to create a test user
export const createTestUser = (overrides: Partial<InsertUser> = {}) => {
  const randomString = Math.random().toString(36).substring(2, 8);
  const defaultUser: InsertUser = {
    email: `${randomString}@test.com`,
    firstName: 'Test',
    lastName: 'User',
    birthday: '1980-01-01',
    referralCode: randomString.toUpperCase(),
    ...overrides
  };
  
  return db.user.create(defaultUser);
};
