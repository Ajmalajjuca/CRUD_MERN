import express from 'express'
import { adminlogin, getAllUsers, deleteUser, updateUser, updateStatus, createUser } from '../controllers/adminControler.js';
import { authMiddleware, isAdmin } from '../middleware/verify.js';

const router = express.Router()

router.post("/adminlogin", adminlogin);
router.get("/dashboard",authMiddleware,isAdmin,  getAllUsers);
router.delete('/deleteUser/:id',authMiddleware,isAdmin, deleteUser);
router.put('/updateUser/:id',authMiddleware,isAdmin, updateUser);
router.put('/updateUserStatus/:id',authMiddleware,isAdmin, updateStatus);
router.post('/addUser',authMiddleware,isAdmin, createUser)


export default router;