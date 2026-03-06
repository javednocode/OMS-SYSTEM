import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// === Browse Products ===

export const getProducts = async (req: any, res: Response) => {
    try {
        const distributorId = req.user.distributorId;
        if (!distributorId) {
            return res.status(403).json({ message: 'Shopkeeper not assigned to a distributor' });
        }

        const products = await prisma.product.findMany({
            where: { distributorId }
        });
        res.json(products);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

// === Orders ===

export const placeOrder = async (req: any, res: Response) => {
    try {
        const { items } = req.body; // Array of { productId, quantity }
        const shopkeeperId = req.user.id;
        const distributorId = req.user.distributorId;

        if (!distributorId) {
            return res.status(403).json({ message: 'Shopkeeper not assigned to a distributor' });
        }

        let totalAmount = 0;
        const orderItemsData: any[] = [];

        // Validations & calculate total
        for (const item of items) {
            const product = await prisma.product.findUnique({ where: { id: item.productId } });
            if (!product || product.distributorId !== distributorId) {
                return res.status(400).json({ message: `Invalid product: ${item.productId}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
            }

            const price = product.price;
            totalAmount += price * item.quantity;

            orderItemsData.push({
                productId: product.id,
                quantity: item.quantity,
                price
            });
        }

        // Transaction for order placement avoiding race conditions on stock
        const result = await prisma.$transaction(async (tx: any) => {
            const order = await tx.order.create({
                data: {
                    shopkeeperId,
                    distributorId,
                    totalAmount,
                    remainingAmount: totalAmount,
                    status: 'PENDING',
                    items: {
                        create: orderItemsData
                    }
                }
            });

            // Update stock
            for (const item of orderItemsData) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }

            return order;
        });

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

export const getOrderHistory = async (req: any, res: Response) => {
    try {
        const shopkeeperId = req.user.id;
        const orders = await prisma.order.findMany({
            where: { shopkeeperId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).send('Server error');
    }
};
