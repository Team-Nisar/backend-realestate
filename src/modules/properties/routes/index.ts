import express from 'express'
import {imageUpload, videoUpload} from '../../../middleware/upload'
import {verifyToken} from '../../../middleware/verifyJWT'
import {createProperty, updateProperty} from '../controllers'
const router = express.Router();

router.use(verifyToken)
router.post("/create", imageUpload, videoUpload, createProperty);
router.put("/update/:id", imageUpload, videoUpload, updateProperty);


export default router