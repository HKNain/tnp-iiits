import { Schema, model } from "mongoose";

const taskSchema = new Schema({
    assignedTo : {
        type : String,
        required : true,
    },
    title : {
        type : String,
        required : true,
        maxlength : 30
    },
    description : {
        type : String,
        required : true,
        maxlength : 300
    },
    lastDate: {
        type : Date,
        required : true
    }
}, {timestamps : true})

const Task = model("Task", taskSchema);

export default Task;