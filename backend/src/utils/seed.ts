import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export async function seedSuperAdmin() {
    try {
        const superAdminEmail = 'admin@oms.com';

        // Check if top-level admin exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: superAdminEmail }
        });

        if (!existingAdmin) {
            console.log(`[SEED] No Super Admin found. Creating default Super Admin (${superAdminEmail})...`);

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            await prisma.user.create({
                data: {
                    name: 'Super Admin',
                    email: superAdminEmail,
                    password: hashedPassword,
                    role: 'SUPER_ADMIN',
                    isActive: true,
                }
            });

            console.log('[SEED] Default Super Admin created successfully.');
        } else {
            console.log('[SEED] Super Admin already exists. Skipping seed.');
        }
    } catch (error) {
        console.error('[SEED] Error seeding Super Admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}
