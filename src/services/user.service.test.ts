// test the createReferralLinkController
import { db } from '../db';
import { getUserById } from './user.service';
import {describe, expect, test} from '@jest/globals'
import { createTestUser } from '../test-helpers/test-data';

// test the createReferralLinkController happy path
describe('getUserById', () => {
    test('an existing user is returned', () => {
        // create a new user
        const user = createTestUser();
        // console.log('user', user);
        const retrievedUser = getUserById(user.id);
        // console.log('retrievedUser', retrievedUser);
        expect(retrievedUser).toBeDefined();
        expect(retrievedUser?.id).toBe(user.id);
        expect(retrievedUser?.email).toBe(user.email);
        expect(retrievedUser?.firstName).toBe(user.firstName);
        expect(retrievedUser?.lastName).toBe(user.lastName);
        expect(retrievedUser?.birthday).toBe(user.birthday);
        expect(retrievedUser?.referralCode).toBe(user.referralCode);
    })
    test('a non-existing user by id returns undefined', () => {
        const retrievedUser = getUserById('non-existing-id');
        expect(retrievedUser).toBeUndefined();
    })
});