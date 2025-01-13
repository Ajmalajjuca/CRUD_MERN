import express from "express";
import { register, login, logout, updateProfile, deleteProfile } from "../controllers/userControler.js";
import upload from '../middleware/multer.js';
import { protect } from "../middleware/verify.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get('/logout', logout);
router.post('/updateProfile',protect, upload.single('image'), updateProfile);
router.post('/deleteProfile',protect, deleteProfile);


export default router;