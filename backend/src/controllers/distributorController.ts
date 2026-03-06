import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// === Shopkeeper Management ===

export const createShopkeeper = async (req: any, res: Response) => {
    try {
        const { name, email, password, mobileNumber, shopName, shopAddress, city, state, pincode, creditLimit } = req.body;
        const distributorId = req.user.id;

        let user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const shopPhotoUrl = req.file ? `http://localhost:4000/uploads/shops/${req.file.filename}` : null;

        user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'SHOPKEEPER',
                distributorId,
                isActive: true,
                mobileNumber,
                shopName,
                shopAddress,
                city,
                state,
                pincode,
                shopPhotoUrl,
                creditLimit: creditLimit ? parseFloat(creditLimit) : 0,
                outstandingBalance: 0,
            }
        });

        res.json({ message: 'Shopkeeper created successfully', userId: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

export const getShopkeepers = async (req: any, res: Response) => {
    try {
        const shopkeepers = await prisma.user.findMany({
            where: { role: 'SHOPKEEPER', distributorId: req.user.id },
            select: {
                id: true, name: true, email: true, isActive: true, createdAt: true,
                mobileNumber: true, shopName: true, shopAddress: true, city: true, state: true, pincode: true, shopPhotoUrl: true,
                creditLimit: true, outstandingBalance: true
            }
        });
        res.json(shopkeepers);
    } catch (error) {
        res.status(500).send('Server error');
    }
};



export const getCreditStats = async (req: any, res: Response) => {
    try {
        const result = await prisma.user.aggregate({
            where: { role: 'SHOPKEEPER', distributorId: req.user.id },
            _sum: { outstandingBalance: true, creditLimit: true }
        });
        res.json({
            totalOutstanding: result._sum.outstandingBalance || 0,
            totalCreditLimit: result._sum.creditLimit || 0
        });
    } catch (error) {
        res.status(500).send('Server error');
    }
};

// === Category Management ===

export const updateShopkeeper = async (req: any, res: Response) => {
    try {
        const id = req.params.id;
        const distributorId = req.user.id;

        const { name, email, mobileNumber, shopName, shopAddress, city, state, pincode, creditLimit } = req.body;

        // Ensure shopkeeper belongs to the distributor
        const exist = await prisma.user.findFirst({ where: { id, distributorId, role: 'SHOPKEEPER' } });
        if (!exist) return res.status(404).json({ message: 'Shopkeeper not found' });

        const shopPhotoUrl = req.file ? `http://localhost:4000/uploads/shops/${req.file.filename}` : exist.shopPhotoUrl;

        const updatedShopkeeper = await prisma.user.update({
            where: { id },
            data: {
                name,
                email,
                mobileNumber,
                shopName,
                shopAddress,
                city,
                state,
                pincode,
                shopPhotoUrl,
                ...(creditLimit !== undefined && { creditLimit: parseFloat(creditLimit) })
            }
        });

        res.json({ message: 'Shopkeeper updated successfully', shopkeeper: updatedShopkeeper });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

export const deleteShopkeeper = async (req: any, res: Response) => {
    try {
        const id = req.params.id;
        const distributorId = req.user.id;

        const shopkeeper = await prisma.user.findFirst({
            where: { id, distributorId, role: 'SHOPKEEPER' },
            include: { ordersAsShopkeeper: true }
        });

        if (!shopkeeper) return res.status(404).json({ message: 'Shopkeeper not found' });

        if (shopkeeper.ordersAsShopkeeper.length > 0) {
            return res.status(400).json({ message: 'Cannot delete shopkeeper with existing orders.' });
        }

        await prisma.user.delete({ where: { id } });

        res.json({ message: 'Shopkeeper deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

export const createCategory = async (req: any, res: Response) => {
    try {
        const { name } = req.body;
        const category = await prisma.category.create({
            data: {
                name,
                distributorId: req.user.id
            }
        });
        res.json(category);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

export const getCategories = async (req: any, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            where: { distributorId: req.user.id }
        });
        res.json(categories);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

export const updateCategory = async (req: any, res: Response) => {
    try {
        const id = req.params.id as string;
        const { name } = req.body;

        const exist = await prisma.category.findFirst({ where: { id, distributorId: req.user.id } });
        if (!exist) return res.status(404).json({ message: 'Category not found' });

        const category = await prisma.category.update({
            where: { id },
            data: { name }
        });
        res.json(category);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

export const deleteCategory = async (req: any, res: Response) => {
    try {
        const id = req.params.id as string;
        const exist = await prisma.category.findFirst({ where: { id, distributorId: req.user.id } });
        if (!exist) return res.status(404).json({ message: 'Category not found' });

        await prisma.category.delete({ where: { id } });
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).send('Server error');
    }
};

// === Product Management ===

export const createProduct = async (req: any, res: Response) => {
    try {
        const { name, categoryId, price, stock, description, isNewArrival } = req.body;
        const distributorId = req.user.id;

        const imageUrl = req.file ? `http://localhost:4000/uploads/products/${req.file.filename}` : req.body.imageUrl;

        const product = await prisma.product.create({
            data: {
                name,
                categoryId,
                price: parseFloat(price),
                stock: parseInt(stock, 10),
                description,
                isNewArrival: isNewArrival === 'true' || isNewArrival === true,
                imageUrl,
                distributorId
            },
            include: { category: true }
        });

        res.json(product);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

export const getProducts = async (req: any, res: Response) => {
    try {
        const { search } = req.query;
        let whereClause: any = { distributorId: req.user.id };

        if (search) {
            whereClause = {
                ...whereClause,
                OR: [
                    { name: { contains: String(search) } },
                    { category: { name: { contains: String(search) } } }
                ]
            };
        }

        const products = await prisma.product.findMany({
            where: whereClause,
            include: { category: true }
        });
        res.json(products);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

export const updateProduct = async (req: any, res: Response) => {
    try {
        const id = req.params.id as string;
        const { name, categoryId, price, stock, description, isNewArrival } = req.body;

        // Ensure product belongs to distributor
        const exist = await prisma.product.findFirst({ where: { id, distributorId: req.user.id } });
        if (!exist) return res.status(404).json({ message: 'Product not found' });

        const imageUrl = req.file ? `http://localhost:4000/uploads/products/${req.file.filename}` : req.body.imageUrl || exist.imageUrl;

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                categoryId,
                price: parseFloat(price),
                stock: parseInt(stock, 10),
                description,
                isNewArrival: isNewArrival === 'true' || isNewArrival === true,
                imageUrl
            },
            include: { category: true }
        });

        res.json(product);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

export const deleteProduct = async (req: any, res: Response) => {
    try {
        const id = req.params.id as string;
        const exist = await prisma.product.findFirst({ where: { id, distributorId: req.user.id } });
        if (!exist) return res.status(404).json({ message: 'Product not found' });

        await prisma.product.delete({ where: { id } });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).send('Server error');
    }
};

// === Order Management ===

export const getOrders = async (req: any, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            where: { distributorId: req.user.id },
            include: {
                items: { include: { product: true } },
                shopkeeper: { select: { id: true, name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

export const updateOrderStatus = async (req: any, res: Response) => {
    try {
        const id = req.params.id as string;
        const { status } = req.body; // PENDING, PACKED, OUT_FOR_DELIVERY, DELIVERED

        const exist = await prisma.order.findFirst({
            where: { id, distributorId: req.user.id },
            include: { shopkeeper: true }
        });
        if (!exist) return res.status(404).json({ message: 'Order not found' });

        if (exist.status !== 'DELIVERED' && status === 'DELIVERED') {
            await prisma.user.update({
                where: { id: exist.shopkeeperId },
                data: { outstandingBalance: { increment: exist.remainingAmount } }
            });
        } else if (exist.status === 'DELIVERED' && status !== 'DELIVERED') {
            await prisma.user.update({
                where: { id: exist.shopkeeperId },
                data: { outstandingBalance: { decrement: exist.remainingAmount } }
            });
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status }
        });

        res.json(order);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

export const recordOrderPayment = async (req: any, res: Response) => {
    try {
        const id = req.params.id as string;
        const distributorId = req.user.id;
        const { amount } = req.body;

        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            return res.status(400).json({ message: 'Invalid payment amount' });
        }

        const order = await prisma.order.findFirst({
            where: { id, distributorId },
            include: { shopkeeper: true }
        });

        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.status !== 'DELIVERED') return res.status(400).json({ message: 'Can only record payment for DELIVERED orders.' });
        if (order.isPaid) return res.status(400).json({ message: 'Order is already paid.' });

        const paymentAmount = parseFloat(amount);
        if (paymentAmount > order.remainingAmount) {
            return res.status(400).json({ message: 'Payment exceeds remaining amount.' });
        }

        const newTotalPaid = order.totalPaid + paymentAmount;
        const newRemaining = order.remainingAmount - paymentAmount;
        const newPaymentStatus = newRemaining === 0 ? "Paid" : "Partial";
        const newIsPaid = newRemaining === 0;

        const shopkeeper = order.shopkeeper;
        const newOutstanding = Math.max(0, shopkeeper.outstandingBalance - paymentAmount);

        // Update order to Paid and reduce shopkeeper outstanding balance within a transaction
        await prisma.$transaction([
            prisma.order.update({
                where: { id },
                data: {
                    totalPaid: newTotalPaid,
                    remainingAmount: newRemaining,
                    paymentStatus: newPaymentStatus,
                    isPaid: newIsPaid
                }
            }),
            prisma.user.update({
                where: { id: shopkeeper.id },
                data: { outstandingBalance: newOutstanding }
            })
        ]);

        res.json({ message: 'Payment recorded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
