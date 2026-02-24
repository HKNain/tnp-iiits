import { Router } from "express";
import {
  allDrives,
  newDrives,
  editDrives,
  deleteDrives,
} from "../controllers/placement.controller.js";
const router = Router();

router.get("/allDrives", allDrives);
router.post("/newDrives", newDrives);
router.patch("/editDrives", editDrives);
router.delete("/deleteDrives", deleteDrives);

export default router;
