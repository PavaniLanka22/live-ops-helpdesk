# Live Ops Helpdesk

A real-time collaborative helpdesk dashboard designed for freight and logistics support teams to manage delivery incidents safely and efficiently.

The project focuses on **concurrency control, WebSockets, race-condition prevention, real-time ticket locking, and automatic cleanup of locks when an agent disconnects.**

## Features

- Real-time ticket management using Socket.IO
- Ticket locking to prevent simultaneous editing
- Server-side concurrency and race-condition handling
- Real-time lock/unlock synchronization across agents
- Automatic release of ticket locks on agent disconnection
- Connection lost and reconnect status indicator
- REST API for retrieving support tickets
- MongoDB integration for ticket data
- Responsive React dashboard
- Multi-window support for simulating multiple support agents

## Technology Stack

**React, Vite, JavaScript, Node.js, Express.js, Socket.IO, MongoDB, Mongoose, Axios, Lucide React, CSS**

## Real-Time Events

### Client → Server

- `join_dashboard` — Registers an agent with the dashboard
- `lock_ticket` — Requests a ticket lock
- `unlock_ticket` — Releases a ticket lock

### Server → Client

- `current_locks` — Sends currently active ticket locks
- `ticket_locked` — Broadcasts a successful ticket lock
- `ticket_unlocked` — Broadcasts a ticket unlock

## Concurrency Handling

The backend maintains active ticket locks using an in-memory `Map`.

Each lock is associated with the ticket ID, agent name, and Socket.IO connection ID.

If multiple agents attempt to lock the same ticket, the server ensures that only one agent obtains the lock. Other connected agents are immediately informed that the ticket is being handled.

If an agent disconnects unexpectedly, the server identifies locks associated with that socket and automatically releases them.

## API

### Get Tickets

```http
GET /api/tickets


<img width="1917" height="967" alt="Screenshot 2026-09-15 132901" src="https://github.com/user-attachments/assets/9d618715-7c24-4428-9c82-52f5ecdf44c9" />


