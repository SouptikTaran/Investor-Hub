import { Router } from "express";
import * as homeController from '../controllers/user.controller.js'
import { authenticateUser } from "../middleware/auth.middleware.js";
const router = Router()

router.post("/signup" ,  homeController.signUp)
router.get("/profile" , authenticateUser , homeController.userProfile)
router.post("/login" , homeController.login)
router.get("/categories" , homeController.getCategories)
router.post("/investors" , authenticateUser,homeController.getInvestorsAndMentors)
router.post("/google" , homeController.googleAuth);

export default router;