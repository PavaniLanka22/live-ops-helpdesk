import Ticket from "../models/Ticket.js";

export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: tickets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tickets"
    });
  }
};

export const createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body);

    res.status(201).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create ticket"
    });
  }
};