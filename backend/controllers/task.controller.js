import Task from "../models/task.model.js";

export const getAllTask = async (req, res) => {
  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Tasks fetched successfully",
      flag: true,
      tasks,
    });
  } catch (error) {
    console.log("error in getAllTask controller", error);
    return res.status(500).json({
      message: "Internal server error while getting task",
      flag: false,
    });
  }
};

export const createNewTask = async (req, res) => {
  try {
    const { assignedTo, title, description, lastDate } = req.body;

    const newTask = new Task({
      assignedTo,
      title,
      description,
      lastDate,
    });

    await newTask.save();

    return res.status(201).json({ flag: true });
  } catch (error) {
    console.log("error in createNewTask controller", error);
    return res.status(500).json({
      message: "Internal server error while creating task",
      flag: false,
    });
  }
};

export const editExistingTask = async (req, res) => {
  try {
    const { taskId, assignedTo } = req.body;

    if (!taskId || !assignedTo) {
      return res.status(400).json({
        message: "taskId and assignedTo are required",
        flag: false,
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { assignedTo },
      { new: true, runValidators: true },
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
        flag: false,
      });
    }

    return res.status(200).json({
      message: "Task assignedTo updated successfully",
      flag: true,
      task: updatedTask,
    });
  } catch (error) {
    console.log("error in editExistingTask controller", error);
    return res.status(500).json({
      message: "Internal server error while editing task",
      flag: false,
    });
  }
};

export const deleteExistingTask = async (req, res) => {
  try {
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).json({
        message: "taskId is required",
        flag: false,
      });
    }

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
        flag: false,
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
      flag: true,
      task: deletedTask,
    });
  } catch (error) {
    console.log("error in deleteExistingTask controller", error);
    return res.status(500).json({
      message: "Internal server error while deleting task",
      flag: false,
    });
  }
};
