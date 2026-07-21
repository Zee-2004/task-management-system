import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { User } from '../types';

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await pool.query<User>('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } as jwt.SignOptions
  );

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

export const logout = catchAsync(async (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});