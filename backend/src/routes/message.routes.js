import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSideBar, SendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get('/users',protectRoute,getUsersForSideBar);

router.get('/chat/:id',protectRoute,getMessages);

router.post('/send/:id',protectRoute,SendMessage);


export default router;
