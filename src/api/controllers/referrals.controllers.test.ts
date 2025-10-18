import { describe, expect, test } from '@jest/globals';
import app from '../../app';
import request from 'supertest';
import { createTestUser } from '../../test-helpers/test-data';

describe('createReferralLinkController', () => {
    test('happy path creates a new referral link', (done) => {
        const user = createTestUser();
        const referralCode = user.referralCode;
        request(app)
            .post(`/api/v1/referral/${referralCode}/link`)
            .set('Authorization', `Bearer ${user.authToken}`)
            .expect(200)
            .end((err, res) => {
                if (err){ 
                    if(res.body){
                        console.error('Response body:', res.body);
                    }
                    return done(err);
                }
                expect(res.body).toHaveProperty('referralLink');
                expect(res.body.referralLink).toBeDefined();
                expect(res.body.referralLink).toContain('https://cartoncaps.link/');
                done(); // Call done() to signal test completion
      });
    });
    test('invalid referral code format returns 400', (done) => {
        const user = createTestUser();
        const referralCode = 'TESTLONGCODE';
        request(app)
            .post(`/api/v1/referral/${referralCode}/link`)
            .set('Authorization', `Bearer ${user.authToken}`)
            .expect(400)
            .end((err, res) => {
                if (err){ 
                    if(res.body){
                        console.error('Response body:', res.body);
                    }
                    return done(err);
                }
                expect(res.body).toHaveProperty('code', 400);
                expect(res.body).toHaveProperty('message', 'Invalid referral code format. Must be 6 alphanumeric characters.');
                done(); // Call done() to signal test completion
      });
    });
    test('invalid channel returns 400', (done) => {
        const user = createTestUser();
        const referralCode = user.referralCode;
        const channel = 'invalid';
        request(app)
            .post(`/api/v1/referral/${referralCode}/link?channel=${channel}`)
            .set('authorization', `Bearer ${user.authToken}`)
            .expect(400)
            .end((err, res) => {
                if (err){ 
                    if(res.body){
                        console.error('Response body:', res.body);
                    }
                    return done(err);
                }
                expect(res.body).toHaveProperty('code', 400);
                expect(res.body.message).toContain('Invalid channel.');
                done();
      });
    });
    test('invalid auth token returns 401', (done) => {
        const referralCode = 'TEST123';
        request(app)
            .post(`/api/v1/referral/${referralCode}/link?channel=email`)
            .set('authorization', `Bearer invalid-token`)
            .expect(401)
            .end((err, res) => {
                if (err){ 
                    if(res.body){
                        console.error('Response body:', res.body);
                    }
                    return done(err);
                }
                expect(res.body).toHaveProperty('code', 401);
                expect(res.body).toHaveProperty('message', 'Invalid authorization token');
                done();
      });
    });
    test('user does not have access to the referral code returns 401', (done) => {
        const user = createTestUser();
        const otherUser = createTestUser();
        const referralCode = otherUser.referralCode;
        request(app)
            .post(`/api/v1/referral/${referralCode}/link`)
            .set('authorization', `Bearer ${user.authToken}`)
            .expect(401)
            .end((err, res) => {
                if (err){ 
                    if(res.body){
                        console.error('Response body:', res.body);
                    }
                    return done(err);
                }
                expect(res.body).toHaveProperty('code', 401);
                done();
      });
    });
});