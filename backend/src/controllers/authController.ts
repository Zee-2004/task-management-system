import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { User } from '../types';

const generateTokens = (userId: string, email: string) => {
  const accessToken = jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET as string,
    { expiresIn: '15m' } as jwt.SignOptions
  );

  const refreshToken = jwt.sign(
    { id: userId, email },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: '7d' } as jwt.SignOptions
  );

  return { accessToken, refreshToken };
};

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

  const { accessToken, refreshToken } = generateTokens(user.id, user.email);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    token: accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token is required', 401);
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as { id: string; email: string };

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      decoded.id,
      decoded.email
    );

    res.status(200).json({
      success: true,
      token: accessToken,
      refreshToken: newRefreshToken,
    });
  } catch {
    throw new AppError('Invalid or expired refresh token. Please log in again.', 401);
  }
});

export const logout = catchAsync(async (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});