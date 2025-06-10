import express from "express";
import  {register ,login ,logout ,updateProfile} from "../controllers/userController.js"
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/profile/update').post(isAuthenticated ,updateProfile);

export default router;
