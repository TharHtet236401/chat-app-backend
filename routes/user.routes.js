import express from 'express';
import { getAllUsers } from '../controllers/user.controller.js';
import { validateToken } from '../middlewares/protectRoute.js';

const router = express.Router();

router.get("/", validateToken(), getAllUsers);

export default router;