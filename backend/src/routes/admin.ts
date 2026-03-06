import express from 'express';
import { createDistributor, getDistributors, toggleDistributorStatus, getSystemAnalytics, editDistributor } from '../controllers/adminController';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require SUPER_ADMIN role
router.use(authenticate, authorizeRoles('SUPER_ADMIN'));

router.post('/distributors', createDistributor);
router.get('/distributors', getDistributors);
router.patch('/distributors/:id', toggleDistributorStatus);
router.get('/analytics', getSystemAnalytics);
router.put('/distributors/:id', editDistributor);

export default router;
