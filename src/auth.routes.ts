import express  from "express";
import authRoutes from './modules/auth/routes'
import { requestLogger } from "./middleware/logMiddleware";
const router = express.Router();

router.use(requestLogger);
router.use('/auth', authRoutes);

export default router;