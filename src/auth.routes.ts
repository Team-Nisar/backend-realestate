import express  from "express";
import authRoutes from './modules/auth/routes'
import adminRoutes from './modules/admin/routes'
import propertyRutes from './modules/properties/routes'
import { requestLogger } from "./middleware/logMiddleware";
const router = express.Router();

router.use(requestLogger);
router.use('/admin', adminRoutes);
router.use('/users/auth', authRoutes);
router.use('/property', propertyRutes)

export default router;