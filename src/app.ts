import express, { Request, Response } from 'express';
import protectedRoutes from './api/routes/protected.routes';
import publicRoutes from './api/routes/public.routes';
import { authenticateToken } from './api/middleware/auth.middleware';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use('/api/v1/', publicRoutes);
app.use('/api/v1/', protectedRoutes); // protected by authentication middleware

export default app;