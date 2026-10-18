import bcrypt from 'bcryptjs';
import { prisma } from '@crm/database';
import { ForbiddenError, NotFoundError } from '../../utils/errors.js';
export async function listUsers(_req, res, next) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    return res.status(200).json({
      status: 'success',
      data: users
    });
  } catch (err) {
    next(err);
  }
}
export async function createUser(req, res, next) {
  try {
    if (req.user?.role !== 'admin') {
      throw new ForbiddenError('Only admins can create users');
    }
    const {
      name,
      email,
      password,
      role
    } = req.body;
    const passwordHash = await bcrypt.hash(password || 'Password123!', 10);
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: role || 'salesperson',
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });
    return res.status(201).json({
      status: 'success',
      data: user
    });
  } catch (err) {
    next(err);
  }
}
export async function updateUser(req, res, next) {
  try {
    if (req.user?.role !== 'admin') {
      throw new ForbiddenError('Only admins can update users');
    }
    const id = req.params.id;
    const {
      name,
      role,
      isActive
    } = req.body;
    const existing = await prisma.user.findUnique({
      where: {
        id
      }
    });
    if (!existing) {
      throw new NotFoundError('User not found');
    }
    const updated = await prisma.user.update({
      where: {
        id
      },
      data: {
        name: name !== undefined ? name : existing.name,
        role: role !== undefined ? role : existing.role,
        isActive: isActive !== undefined ? isActive : existing.isActive
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true
      }
    });
    return res.status(200).json({
      status: 'success',
      data: updated
    });
  } catch (err) {
    next(err);
  }
}