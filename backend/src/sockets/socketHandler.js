const ticketLocks = new Map();

export const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Agent joins dashboard
    socket.on("join_dashboard", (data) => {
      console.log(
        `${data.agentName} joined the dashboard`
      );

      socket.emit(
        "current_locks",
        Array.from(ticketLocks.entries())
      );
    });

    // Lock ticket
    socket.on("lock_ticket", ({ ticketId, agentName }) => {
      console.log(
        `${agentName} requested lock for ticket ${ticketId}`
      );

      const existingLock = ticketLocks.get(ticketId);

      // Ticket is already locked
      if (existingLock) {
        console.log(
          `Ticket ${ticketId} already locked by ${existingLock.agentName}`
        );

        socket.emit("lock_rejected", {
          ticketId,
          message: `Ticket is already locked by ${existingLock.agentName}`
        });

        return;
      }

      // Ticket is available
      const lockData = {
        socketId: socket.id,
        agentName
      };

      ticketLocks.set(ticketId, lockData);

      console.log(
        `Ticket ${ticketId} locked by ${agentName}`
      );

      // Tell ALL connected clients
      io.emit("ticket_locked", {
        ticketId,
        agentName
      });
    });

    // Unlock ticket
    socket.on("unlock_ticket", ({ ticketId }) => {
      const existingLock = ticketLocks.get(ticketId);

      if (!existingLock) {
        return;
      }

      // Only the owner can unlock
      if (existingLock.socketId !== socket.id) {
        socket.emit("unlock_rejected", {
          ticketId,
          message: "You do not own this ticket"
        });

        return;
      }

      ticketLocks.delete(ticketId);

      console.log(
        `Ticket ${ticketId} unlocked`
      );

      io.emit("ticket_unlocked", {
        ticketId
      });
    });

    // Ghost disconnect handler
    socket.on("disconnect", () => {
      console.log(
        "Socket disconnected:",
        socket.id
      );

      for (const [ticketId, lockData] of ticketLocks.entries()) {
        if (lockData.socketId === socket.id) {
          ticketLocks.delete(ticketId);

          console.log(
            `Ghost lock released: ticket ${ticketId}`
          );

          io.emit("ticket_unlocked", {
            ticketId
          });
        }
      }
    });
  });
};