import express from "express";
import {registerCompany ,getCompnay ,getCompanyById ,updateCompany} from "../controllers/companyController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(isAuthenticated,registerCompany);
router.route("/get").get(isAuthenticated,getCompnay);
router.route("/get/:id").get(isAuthenticated,getCompanyById);
router.route("/update/:id").put(isAuthenticated,updateCompany);

export default router;