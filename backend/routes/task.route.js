import { Router } from "express";
import {getAllTask, createNewTask, editExistingTask, deleteExistingTask} from "../controllers/task.controller.js";
const router = Router();

router.get("/allTask", getAllTask);
router.post("/newTask", createNewTask);
router.patch("/editTask", editExistingTask);
router.delete("/deleteTask", deleteExistingTask);

export default router;