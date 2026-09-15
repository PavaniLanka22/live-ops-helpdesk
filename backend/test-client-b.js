import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const agentName = "Agent B";

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  socket.emit("join_dashboard", {
    agentName
  });

  setTimeout(() => {
    console.log("Agent B requesting ticket lock...");

    socket.emit("lock_ticket", {
      ticketId: "105",
      agentName
    });
  }, 2000);
});

socket.on("current_locks", (locks) => {
  console.log("Current locks:", locks);
});

socket.on("ticket_locked", (data) => {
  console.log("TICKET LOCKED:", data);
});

socket.on("lock_rejected", (data) => {
  console.log("LOCK REJECTED:", data);
});

socket.on("ticket_unlocked", (data) => {
  console.log("TICKET UNLOCKED:", data);
});