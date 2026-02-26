import express from "express";
import { initiateReturn } from "../controllers/return.controller.js";
import { protect } from "../middleware/auth.js";
import { isAgent } from "../middleware/role.js";

const router = express.Router();

router.post("/:orderId/initiate", protect, isAgent, initiateReturn);

export default router;
