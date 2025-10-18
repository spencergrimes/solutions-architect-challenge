import { Router } from 'express';
import { createReferralLinkController } from '../controllers/referrals.controllers';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

// POST /referral/{referralCode}/link
// Create a new link for a referral code
router.post('/referral/:referralCode/link', createReferralLinkController);

export default router;