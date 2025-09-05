import { Router } from "express";
import { UserController } from "../controllers/user_controllers";
import { checkToken } from "../middlewares/checkToken";

const router = Router();

router.post("/register", UserController.registration);
router.post("/login", UserController.login);
router.get("/:id", checkToken, UserController.getUser);
router.get("/", checkToken, UserController.getAllUsers);
router.patch("/block/:id", checkToken, UserController.blockUser);

export default router;