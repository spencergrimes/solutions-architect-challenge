import { Request, Response, NextFunction } from 'express';
import { User } from '../../types/referral.types';
import { db } from '../../db';

// declaring global namespace to add user to the request object since this will be a standard pattern
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split('Bearer ')[1];
    if (!token) {
        return res.status(401).json({ code: 401, message: 'Authorization token is required' });
    }
    // this is NOT how we would do this in production, but just so we can demonstrate auth without implementing a full JWT auth process
    const user = db.user.findOne({authToken: token});
    if(user){
        req.user = user;
        next();
    } else {
        return res.status(401).json({ code: 401, message: 'Invalid authorization token' });
    }
}