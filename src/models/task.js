import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      // data stored in owner is going to be a ObjectID
      type: mongoose.Schema.Types.ObjectId,
      // you must provide an owner for the task
      required: true,
      // ref is short for reference to another model
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Create the task model
const Task = mongoose.model("Task", taskSchema);

export { Task };
