import express from "express"
import { signup ,login,logout } from "../controllers/authcontroller.js";
import { updateProfile , checkAuth} from "../controllers/authcontroller.js";
import { protectRoute } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = express.Router();


router.post("/signup" , signup);

router.post("/login" , login);
router.post("/logout" , logout);
router.post("/update-profile",protectRoute,upload.single("profilePic"),updateProfile);

router.get("/check" , protectRoute ,checkAuth);

export default router ;