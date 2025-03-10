import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/verifyToken";

const controller = new authController();
const auth_router = Router();

auth_router.post('/login', controller.loginUser);
auth_router.get('/check-details', verifyToken, controller.checkDetails)
auth_router.post('/logout', verifyToken, controller.logoutUser);
export default auth_router;
