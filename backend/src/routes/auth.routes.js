import express from "express";
import { OauthPass,checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import passport from "passport";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get('/googleOauth',passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/googleOauth/callback',passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:5173/login' }),OauthPass);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;