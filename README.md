# Live Ops Helpdesk

A real-time collaborative support dashboard built to help freight and logistics support teams manage delivery incidents without conflicting edits between agents.

The application demonstrates real-time collaboration using **WebSockets, Socket.IO, concurrency control, ticket locking, race-condition prevention, and automatic lock cleanup when an agent disconnects**.

---
## Project Overview
### Client

**RapidDispatch Freight & Logistics**  
Dallas, Texas, USA

### Project Code Name

**Live Ops Helpdesk**

### Project Focus

Real-time support operations for freight delivery incidents. Support agents may need to work on the same ticket simultaneously. Without concurrency control, two agents could edit the same ticket at the same time, resulting in conflicting updates or overwritten work.
The Live Ops Helpdesk solves this problem by introducing a real-time ticket locking mechanism.

---
## Problem Statement

In a live freight support environment, multiple support agents may access the same delivery incident simultaneously. This creates several concurrency challenges:

- Multiple agents attempting to edit the same ticket
- Race conditions when two agents request the same ticket simultaneously
- Lack of visibility into who is currently handling a ticket
- Tickets remaining locked when an agent unexpectedly disconnects
- UI state becoming outdated across connected agents
- Loss of coordination between support agents

The system addresses these issues using Socket.IO-based real-time communication and server-side in-memory lock management.

---
## Key Features

### Real-Time Ticket Locking

Agents can request ownership of a ticket through Socket.IO. When a ticket is successfully locked:

- The server records the lock.
- The locking agent becomes the ticket owner.
- All connected agents receive the updated lock state immediately.

### Concurrency Control

Only one connected agent can hold a ticket lock at a time.
If another agent attempts to lock an already locked ticket, the request is rejected.
This prevents simultaneous editing conflicts.

### Race-Condition Prevention

Ticket lock decisions are handled on the server rather than relying on the frontend.
The server maintains the authoritative lock state, ensuring competing lock requests are resolved consistently.

### Real-Time Synchronization

Lock and unlock events are broadcast to connected dashboard clients.
Agents do not need to manually refresh the page to see changes.

### Ghost Disconnect Cleanup

If an agent disconnects while holding a ticket lock, the server automatically identifies the locks owned by that socket and releases them.
This prevents tickets from remaining permanently locked.

### Connection Status

The frontend displays the current Socket.IO connection state.
When the connection is lost, users receive a connection-lost/reconnecting indication.

### Two-Agent Collaboration

The dashboard can be opened in multiple browser windows to simulate multiple support agents working simultaneously.
Each browser session receives a unique agent name.

---

## Technology Stack

### Frontend: 
React, Vite, JavaScript, Axios, Socket.IO Client, Lucide React, CSS

### Backend

Node.js, Express.js, Socket.IO, MongoDB, Mongoose, CORS, dotenv

### Development Tools

Visual Studio Code, Git, GitHub, Postman, Browser DevTools

---

## Architecture
                    ┌─────────────────────────┐
                    │       React Client      │
                    │                         │
                    │  Dashboard              │
                    │  Ticket Cards           │
                    │  Connection Status      │
                    └───────────┬─────────────┘
                                │
                   HTTP REST    │    WebSocket
                                │
              ┌─────────────────┴─────────────────┐
              │                                   │
              ▼                                   ▼
     ┌─────────────────┐                 ┌─────────────────┐
     │ Express REST API│                 │    Socket.IO    │
     │                 │                 │                 │
     │ GET /api/tickets│                 │ lock_ticket     │
     │                 │                 │ unlock_ticket   │
     └────────┬────────┘                 │ join_dashboard  │
              │                          └────────┬────────┘
              │                                   │
              ▼                                   ▼
     ┌─────────────────┐                 ┌─────────────────┐
     │     MongoDB     │                 │  In-Memory Lock │
     │                 │                 │      Map        │
     │ Ticket Data     │                 │                 │
     └─────────────────┘                 └─────────────────┘


     <img width="1906" height="914" alt="image" src="https://github.com/user-attachments/assets/f4efc72f-1889-4adc-b893-6fab76dd85fe" />

