import express from 'express';
import { sendMessage, getMessages } from '../controllers/message.controller.js';
import { validateToken } from '../middlewares/protectRoute.js';
const router = express.Router();

router.post("/send/:id", validateToken,sendMessage);
router.get("/:id", validateToken,getMessages);

export default router;