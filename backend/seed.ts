import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@oms.com';
    const existing = await prisma.user.findUnique({ where: { email } });

    if (!existing) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        await prisma.user.create({
            data: {
                name: 'Super Admin',
                email,
                password: hashedPassword,
                role: 'SUPER_ADMIN',
                isActive: true
            }
        });
        console.log('Super Admin created: admin@oms.com / admin123');
    } else {
        console.log('Super Admin already exists');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
