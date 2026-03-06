import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({ message: 'Account disabled. Contact administrator.' });
        }

        // Check if distributor subscription expired
        if (user.role === 'DISTRIBUTOR') {
            if (user.subscriptionEndDate && new Date() > new Date(user.subscriptionEndDate)) {
                return res.status(403).json({ message: 'Subscription expired. Please contact administrator.' });
            }
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT Payload
        const payload = {
            id: user.id,
            role: user.role,
            distributorId: user.distributorId
        };

        // Sign Token
        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'super-secret-jwt-key-for-oms',
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        distributorId: user.distributorId
                    }
                });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

export const register = async (req: Request, res: Response) => {
    // This is minimal since normally super admins create distributors, 
    // and distributors create shopkeepers.
    // We'll leave this hidden route to create the very first super-admin,
    // or handle generic user creation if permitted.
    try {
        const { name, email, password, role } = req.body;

        let user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'SUPER_ADMIN'
            }
        });

        res.json({ message: 'User created successfully', userId: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

export const getMe = async (req: any, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, name: true, email: true, role: true, distributorId: true, isActive: true }
        });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
