import express from 'express';
import { getProducts, placeOrder, getOrderHistory } from '../controllers/shopkeeperController';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticate, authorizeRoles('SHOPKEEPER'));

router.get('/products', getProducts);
router.post('/orders', placeOrder);
router.get('/orders', getOrderHistory);

export default router;
