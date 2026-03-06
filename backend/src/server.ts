import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import distributorRoutes from './routes/distributor';
import shopkeeperRoutes from './routes/shopkeeper';

import path from 'path';
import { seedSuperAdmin } from './utils/seed';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/distributor', distributorRoutes);
app.use('/api/shopkeeper', shopkeeperRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'OMS Backend is running' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  await seedSuperAdmin();
  console.log(`Server running on port ${PORT}`);
});
