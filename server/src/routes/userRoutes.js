import express from "express";
import { register, login, logout, updateProfile, deleteProfile } from "../controllers/userControler.js";
import upload from '../middleware/multer.js';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get('/logout', logout);
router.post('/updateProfile', upload.single('image'), updateProfile);
router.post('/deleteProfile', deleteProfile);


export default router;