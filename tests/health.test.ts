import { describe, expect, test } from '@jest/globals';
import app from '../src/app';
import request from 'supertest';

describe('Health check', () => {
    test('should return 200', (done) => {
        request(app)
            .get('/api/v1/health')
            .expect(200)
            .expect({ message: 'OK' })
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).toEqual({ message: 'OK' });
                done(); // Call done() to signal test completion
      });
    });
});