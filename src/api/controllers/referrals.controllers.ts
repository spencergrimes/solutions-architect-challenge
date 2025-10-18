import { Request, Response } from 'express';
import { createReferralRecord } from '../../services/referral.service';
import { getUserById } from '../../services/user.service';

// Controller for creating a new link for a referral code
// if an incomplete link already exists for the referral code, channel and referring user, return the existing link
export const createReferralLinkController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { referralCode } = req.params;
    const { channel = 'other' } = req.query;
    const referringUserId = req.user?.id; // user ID comes from auth middleware
  
    if (!referringUserId) {
      //this should never happen because of the auth middleware
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Validate referral code format (6 alphanumeric characters)
    if (!/^[A-Z0-9]{6}$/i.test(referralCode)) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid referral code format. Must be 6 alphanumeric characters.'
      });
    }

    // Validate channel
    if (!['email', 'sms', 'other'].includes(channel as string)) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid channel. Must be email, text, or other.'
      });
    }

    // Validate referring user
    const referringUser = getUserById(referringUserId);
    // Validate that the referring user has access to the referral code
    if (referringUser?.referralCode !== referralCode) {
      return res.status(401).json({
        code: 401,
        message: 'Referring user does not have access to the referral code.'
      });
    }

    const referral = createReferralRecord({
      referralCode: referralCode.toUpperCase(),
      referringUserId,
      channel: channel as 'email' | 'sms' | 'other'
    });
    
    return res.json({ referralLink: referral.deepLink });
    
  } catch (error) {
      console.error('Error creating referral link:', error);
      return res.status(500).json({ code: 500, message: 'An internal server error occurred' });
  }
};