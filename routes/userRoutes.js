import express from "express";
import  {register ,login ,logout ,updateProfile} from "../controllers/userController.js"
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route('/register').post(register);     // POST /api/v1/user/register
router.route('/login').post(login);           // POST /api/v1/user/login
router.route('/logout').post(logout);         // POST /api/v1/user/logout
router.route('/profile/update').post(isAuthenticated ,updateProfile);   //POST /api/v1/user/profile/update (auth protected)

export default router;
