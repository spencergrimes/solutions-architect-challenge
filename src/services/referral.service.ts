import { db } from "../db";
import { generateDeepLink } from "../mock/deeplink.mock";
import { Referral } from "../types/referral.types";

export const createReferralRecord = (params: { referralCode: string, referringUserId: string, channel: 'email' | 'sms' | 'other' } ) : Referral => {
    const { referralCode, referringUserId, channel } = params;
    // check to see if a pending refreral record already exists for this referral code, channel and referring user
    // console.debug('Checking for existing referral record', { referralCode, referringUserId, channel, status: 'pending' });
    const existingReferral = db.referral.findOne({ referralCode, referringUserId, channel, status: 'pending' });
    if (existingReferral) {
        // console.debug('Existing referral record found', existingReferral);
        return existingReferral;
    }
    else {  
        // Generate a new deep link (simplified for this implementation)
        const referralLink = `cartoncapsapp://signup?referralCode=${referralCode}&channel=${channel}&referringUserId=${referringUserId}`;
        const deepLink = generateDeepLink(referralLink);
        // create the referral record in the database
        const referral = db.referral.create({
            referralCode,
            referringUserId,
            channel,    
            deepLink,
            status: 'pending',
            });
        return referral;
    }
};