// lib/jwt-service.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'integriguide-secret-key';
const JWT_EXPIRES_IN = '24h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

export function generateTokens(userId: string) {
  const accessToken = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
  
  return { accessToken, refreshToken };
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function refreshAccessToken(refreshToken: string) {
  const payload = verifyToken(refreshToken);
  if (!payload) return null;
  
  return generateTokens(payload.sub as string);
}