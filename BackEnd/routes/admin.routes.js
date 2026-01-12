import express from "express";
import { approveAgent } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/agents/:agentId/approve", approveAgent);

export default router;
