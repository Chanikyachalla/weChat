import express from "express"
import { signup ,login,logout } from "../controllers/authcontroller.js";
import { updateProfile } from "../controllers/authcontroller.js";
import { protectRoute } from "../middlewares/auth.js";

const router = express.Router();


router.post("/signup" , signup);

router.post("/login" , login);
router.post("/logout" , logout);
router.put("/update-profile",protectRoute,updateProfile);



export default router ;