// test the createReferralLinkController
import { createReferralRecord } from './referral.service';
import {describe, expect, test} from '@jest/globals'
import { createTestUser } from '../test-helpers/test-data';

// test the createReferralLinkController happy path
describe('createReferralRecord', () => {
    test('happy path creates a new referral link', () => {
        // create a new user
        const user = createTestUser();
        // create a new referral link
        const referral = createReferralRecord({
            referralCode: 'TEST123',
            referringUserId: user.id,
            channel: 'email',
        });
        expect(referral).toBeDefined();
        expect(referral.referralCode).toBe('TEST123');
        expect(referral.referringUserId).toBe(user.id);
        expect(referral.channel).toBe('email');
        expect(referral.status).toBe('pending');
        expect(referral.deepLink).toBeDefined();
    })
    test('existing pending referral record for the same referral code and channelreturns the existing record', () => {
        // create a new user
        const user = createTestUser();
        // create a new referral link
        const referral = createReferralRecord({
            referralCode: 'TEST123',
            referringUserId: user.id,
            channel: 'email',
        });
        // try to create a new referral link for the same referral code and channel
        const referral2 = createReferralRecord({
            referralCode: 'TEST123',
            referringUserId: user.id,
            channel: 'email',
        });
        // check the significant values of the referral record are the same
        expect(referral2.id).toBe(referral.id);
        expect(referral2.referralCode).toBe(referral.referralCode);
        expect(referral2.referringUserId).toBe(referral.referringUserId);
        expect(referral2.channel).toBe(referral.channel);
        expect(referral2.status).toBe(referral.status);
        expect(referral2.deepLink).toBe(referral.deepLink);
    })
    test('existing pending referral record for a different channel returns a new record', () => {
       // create user
       const user = createTestUser();
        // create a new referral link
        const referral = createReferralRecord({
            referralCode: 'TEST123',
            referringUserId: user.id,
            channel: 'email',
        });
        // create a new referral link
        const referral2 = createReferralRecord({
            referralCode: 'TEST123',
            referringUserId: user.id,
            channel: 'other',
        });
        // check the significant values of the referral record are the same
        expect(referral2.id).not.toBe(referral.id);
        expect(referral2.deepLink).not.toBe(referral.deepLink);
    })
});