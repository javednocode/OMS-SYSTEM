import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createDistributor = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

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
                role: 'DISTRIBUTOR',
                isActive: true
            }
        });

        res.json({ message: 'Distributor created successfully', userId: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

export const getDistributors = async (req: Request, res: Response) => {
    try {
        const distributors = await prisma.user.findMany({
            where: { role: 'DISTRIBUTOR' },
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
                createdAt: true,
                subscriptionStartDate: true,
                subscriptionEndDate: true,
                isSubscriptionActive: true
            }
        });
        res.json(distributors);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

export const editDistributor = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { name, email, password, isActive, subscriptionStartDate, subscriptionEndDate } = req.body;

        const distributor = await prisma.user.findUnique({ where: { id: id as string, role: 'DISTRIBUTOR' } });
        if (!distributor) return res.status(404).json({ message: 'Distributor not found' });

        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (subscriptionStartDate) updateData.subscriptionStartDate = new Date(subscriptionStartDate);
        if (subscriptionEndDate) updateData.subscriptionEndDate = new Date(subscriptionEndDate);

        // Optional password logic
        if (password && password.trim().length > 0) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updated = await prisma.user.update({
            where: { id: id as string },
            data: updateData,
            select: {
                id: true, name: true, email: true, isActive: true, subscriptionStartDate: true, subscriptionEndDate: true
            }
        });

        res.json({ message: 'Distributor updated successfully', distributor: updated });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

export const toggleDistributorStatus = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { isActive } = req.body; // boolean

        const user = await prisma.user.update({
            where: { id },
            data: { isActive }
        });

        res.json({ message: 'Distributor status updated', isActive: user.isActive });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

export const getSystemAnalytics = async (req: Request, res: Response) => {
    try {
        const distributorsCount = await prisma.user.count({ where: { role: 'DISTRIBUTOR' } });
        const shopkeepersCount = await prisma.user.count({ where: { role: 'SHOPKEEPER' } });
        const totalOrders = await prisma.order.count();

        // Sum total amounts using aggregation
        const ordersResult = await prisma.order.aggregate({
            _sum: { totalAmount: true }
        });
        const totalRevenue = ordersResult._sum.totalAmount || 0;

        res.json({
            distributorsCount,
            shopkeepersCount,
            totalOrders,
            totalRevenue
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
