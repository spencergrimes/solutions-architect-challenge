import { Router, Request, Response } from 'express';

const router = Router();

// THIS IS WHERE WE WOULD ADD PUBLIC ENDPOINTS THAT ARE NOT SECURED BY AUTHENTICATION

router.get('/health', (req: Request, res: Response) => {
    res.json({ message: 'OK' });
});
// User registration (public)
// router.post('/user', createUser);

// Referral validation (public)
// router.post('/referral/validate', validateReferralCode);

export default router;