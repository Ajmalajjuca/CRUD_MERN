import express from 'express'
import { adminlogin, getAllUsers, deleteUser, updateUser, updateStatus, createUser } from '../controllers/adminControler.js';

const router = express.Router()

router.post("/adminlogin", adminlogin);
router.get("/dashboard",  getAllUsers);
router.delete('/deleteUser/:id', deleteUser);
router.put('/updateUser/:id', updateUser);
router.put('/updateUserStatus/:id', updateStatus);
router.post('/addUser', createUser)


export default router;