import { Router } from "express";

// Controllers
import userController from "./user/ctrl";
import leaderboardController from "./leaderboard/ctrl";
import authController from "./auth/ctrl";

// Middlewares
import { auth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/ping", (_, res) => res.send("pong"));

// auth
router.route("/register").post(authController.register);
router.route("/login").post(authController.login);

// user
router.route("/user/me").get(auth, userController.me);

// leaderboard
router.route("/leaderboard").get(leaderboardController.getLeaderboard);

export default router;
