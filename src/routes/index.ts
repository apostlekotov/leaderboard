import { Router } from "express";

// Controllers
import userController from "./user/ctrl";
import leaderboardController from "./leaderboard/ctrl";
import authController from "./auth/ctrl";

// Middlewares
import { auth } from "../middlewares/auth.middleware";
import { appAuth } from "../middlewares/appAuth.middleware";

const router = Router();

router.get("/ping", (_, res) => res.send("pong"));

// auth
router.route("/auth/register").post(authController.register);
router.route("/auth/login").post(authController.login);

router.route("/get-app-token").get(authController.getAppToken);

// user
router.route("/user/me").get(auth, userController.me);

router.route("/user/:id/verify-email").post(userController.verifyEmail);

router.route("/user/reset-password").post(auth, userController.resetPassword);

router
  .route("/user")
  .put([auth, appAuth], userController.updateUserScore)
  .delete(auth, userController.deleteUser);

// leaderboard
router
  .route("/leaderboard")
  .get(auth, leaderboardController.getLeaderboard)
  .delete(appAuth, leaderboardController.clearLeaderboard);

router
  .route("/leaderboard/best")
  .get(leaderboardController.getLeaders)
  .delete(appAuth, leaderboardController.clearLeaders);

export default router;
