import { Router } from "express";
import { handleLogin, handleSignup, getAllUser} from "../controllers/auth.controller.js";
import { loginValidation, signUpValidation } from "../utils/validationAuth.js";
const router = Router();

router.post("/signup",signUpValidation, handleSignup);
router.post("/login", loginValidation, handleLogin);
router.get("/allUsers", getAllUser);

export default router;