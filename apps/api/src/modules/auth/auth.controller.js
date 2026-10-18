import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@crm/database';
import { LoginSchema } from '@crm/shared';
import { ENV } from '../../config/env.js';
import { UnauthorizedError } from '../../utils/errors.js';
import { recordAuditLog } from '../../middleware/audit.js';
export async function login(req, res, next) {
  try {
    const {
      email,
      password
    } = LoginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase()
      }
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid email or password');
    }
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        lastLoginAt: new Date()
      }
    });
    const token = jwt.sign({
      userId: user.id,
      email: user.email,
      role: user.role
    }, ENV.SESSION_SECRET, {
      expiresIn: '7d'
    });
    res.cookie('token', token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    await recordAuditLog({
      actorUserId: user.id,
      action: 'USER_LOGIN',
      entityType: 'users',
      entityId: user.id,
      ipAddress: req.ip
    });
    return res.status(200).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (err) {
    next(err);
  }
}
export async function logout(req, res) {
  if (req.user) {
    await recordAuditLog({
      actorUserId: req.user.id,
      action: 'USER_LOGOUT',
      entityType: 'users',
      entityId: req.user.id,
      ipAddress: req.ip
    });
  }
  res.clearCookie('token');
  return res.status(200).json({
    status: 'success',
    message: 'Successfully logged out'
  });
}
export async function getMe(req, res, next) {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true
      }
    });
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    return res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (err) {
    next(err);
  }
}