import express from "express";
import { register, login, logout, updateProfile, deleteProfile } from "../controllers/userControler.js";
import upload from '../middleware/multer.js';
import { authMiddleware } from "../middleware/verify.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get('/logout', logout);
router.post('/updateProfile',authMiddleware, upload.single('image'), updateProfile);
router.post('/deleteProfile',authMiddleware, deleteProfile);


export default router;