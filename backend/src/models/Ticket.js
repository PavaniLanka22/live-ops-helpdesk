import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    customerName: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open"
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium"
    }
  },
  {
    timestamps: true
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;