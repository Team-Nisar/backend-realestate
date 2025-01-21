import express from "express";
import {RegisterUser, loginUser, forgotPassword, resetPassword, getUserDetails, UpdateUserDetails} from '../controllers';
import { verifyToken } from "../../../middleware/verifyJWT";
const router = express.Router();


// Public Routes
router.post('/register', RegisterUser);
router.post('/login', loginUser);
router.post('/forget-password', forgotPassword)
router.post('/reset-password', resetPassword)

// Private Routes
router.use(verifyToken);
router.get('/get-user', getUserDetails)
router.patch('/update-details', UpdateUserDetails)

export default router;