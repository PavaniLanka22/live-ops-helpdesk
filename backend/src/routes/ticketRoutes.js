import express from "express";

import {
  getTickets,
  createTicket
} from "../controllers/ticketController.js";

const router = express.Router();

router.get("/", getTickets);
router.post("/", createTicket);

export default router;