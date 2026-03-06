import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    createShopkeeper, getShopkeepers, updateShopkeeper, deleteShopkeeper, getCreditStats,
    createProduct, getProducts, updateProduct, deleteProduct,
    getOrders, updateOrderStatus, recordOrderPayment,
    createCategory, getCategories, updateCategory, deleteCategory
} from '../controllers/distributorController';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads/products'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const shopStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads/shops'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'shop-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadShop = multer({ storage: shopStorage });

router.use(authenticate, authorizeRoles('DISTRIBUTOR'));

router.post('/shopkeepers', uploadShop.single('shopPhoto'), createShopkeeper);
router.get('/shopkeepers', getShopkeepers);
router.put('/shopkeepers/:id', uploadShop.single('shopPhoto'), updateShopkeeper);
router.delete('/shopkeepers/:id', deleteShopkeeper);
router.get('/credit-stats', getCreditStats);


router.post('/products', upload.single('image'), createProduct);
router.get('/products', getProducts);
router.put('/products/:id', upload.single('image'), updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/orders', getOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.post('/orders/:id/payment', recordOrderPayment);

router.post('/categories', createCategory);
router.get('/categories', getCategories);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

export default router;
