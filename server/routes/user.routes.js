import express from 'express';
import { register, login, googleLogin } from '../controller/user.controller.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/google
router.post('/google-login', googleLogin);

export default router;
