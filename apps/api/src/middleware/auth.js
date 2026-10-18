import jwt from 'jsonwebtoken';
import { prisma } from '@crm/database';
import { ENV } from '../config/env.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
export async function authenticate(req, _res, next) {
  try {
    let token = req.cookies?.token;
    const authHeader = req.headers.authorization;
    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    if (!token) {
      throw new UnauthorizedError('Authentication required');
    }
    const decoded = jwt.verify(token, ENV.SESSION_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId
      }
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User account not found or disabled');
    }
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Invalid or expired session token'));
    }
    next(err);
  }
}
export function requireRole(allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError(`Access denied. Allowed roles: ${allowedRoles.join(', ')}`));
    }
    next();
  };
}