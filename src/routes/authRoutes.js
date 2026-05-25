import { Router } from 'express';
import { login } from '../controllers/authController.js';

const authRoutes = new Router();
authRoutes.post('/auth/login', login);

export default authRoutes;