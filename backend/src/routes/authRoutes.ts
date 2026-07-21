import { Router } from 'express';
import { body } from 'express-validator';
import { login, logout } from '../controllers/authController';
import { runValidation } from '../middleware/validate';

const router = Router();

router.post(
  '/login',
  runValidation([
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  login
);

router.post('/logout', logout);

export default router;