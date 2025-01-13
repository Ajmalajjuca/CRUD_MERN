import express from 'express'
import { adminlogin, getAllUsers, deleteUser, updateUser, updateStatus, createUser } from '../controllers/adminControler.js';
import { protect, verifyAdmin } from '../middleware/verify.js';

const router = express.Router()

router.post("/adminlogin", adminlogin);
router.get("/dashboard",  getAllUsers);
router.delete('/deleteUser/:id',protect,verifyAdmin, deleteUser);
router.put('/updateUser/:id',protect,verifyAdmin, updateUser);
router.put('/updateUserStatus/:id',protect,verifyAdmin, updateStatus);
router.post('/addUser',protect,verifyAdmin, createUser)


export default router;