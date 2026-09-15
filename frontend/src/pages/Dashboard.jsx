import {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Headphones,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import TicketCard from "../components/TicketCard";
import ConnectionStatus from "../components/ConnectionStatus";

import socket from "../socket";

const API_URL =
  `${import.meta.env.VITE_API_URL}/tickets`;

const Dashboard = () => {
  /* =====================================================
     TICKETS
  ===================================================== */

  const [tickets, setTickets] = useState([]);



  const [locks, setLocks] = useState({});

  /* =====================================================
     CONNECTION STATE
  ===================================================== */

  const [connected, setConnected] =
    useState(socket.connected);


  const [agentName] = useState(
    () =>
      `Agent-${Math.floor(
        Math.random() * 900 + 100
      )}`
  );

  /* =====================================================
     FETCH TICKETS
  ===================================================== */

  const fetchTickets = async () => {
    try {
      console.log(
        "Fetching tickets..."
      );

      const response =
        await axios.get(API_URL);

      console.log(
        "Tickets received:",
        response.data
      );

      setTickets(
        response.data.data || []
      );
    } catch (error) {
      console.error(
        "Failed to load tickets:",
        error
      );
    }
  };

  /* =====================================================
     SOCKET.IO EVENTS
  ===================================================== */

  useEffect(() => {
    /*
      Load existing tickets from MongoDB.
    */
    fetchTickets();

    /* -----------------------------------------------
       SOCKET CONNECT
    ----------------------------------------------- */

    const handleConnect = () => {
      console.log(
        "Frontend socket connected:",
        socket.id
      );

      setConnected(true);


      socket.emit(
        "join_dashboard",
        {
          agentName,
        }
      );
    };

    /* -----------------------------------------------
       SOCKET DISCONNECT
    ----------------------------------------------- */

    const handleDisconnect = () => {
      console.log(
        "Frontend socket disconnected"
      );

      setConnected(false);
    };



    const handleCurrentLocks = (
      currentLocks
    ) => {
      console.log(
        "Current locks received:",
        currentLocks
      );

      const lockMap = {};

      currentLocks.forEach(
        ([ticketId, lockData]) => {
          lockMap[ticketId] =
            lockData;
        }
      );

      setLocks(lockMap);
    };



    const handleTicketLocked = ({
      ticketId,
      agentName: lockingAgent,
      socketId,
    }) => {
      console.log(
        "Ticket locked:",
        ticketId,
        lockingAgent
      );

      setLocks(
        (previous) => ({
          ...previous,

          [ticketId]: {
            agentName:
              lockingAgent,

            socketId,
          },
        })
      );
    };


    const handleTicketUnlocked = ({
      ticketId,
    }) => {
      console.log(
        "Ticket unlocked:",
        ticketId
      );

      setLocks(
        (previous) => {
          const updated = {
            ...previous,
          };

          delete updated[ticketId];

          return updated;
        }
      );
    };

    /* =================================================
       REGISTER SOCKET LISTENERS
    ================================================= */

    socket.on(
      "connect",
      handleConnect
    );

    socket.on(
      "disconnect",
      handleDisconnect
    );

    socket.on(
      "current_locks",
      handleCurrentLocks
    );

    socket.on(
      "ticket_locked",
      handleTicketLocked
    );

    socket.on(
      "ticket_unlocked",
      handleTicketUnlocked
    );


    if (socket.connected) {
      handleConnect();
    }


    return () => {
      socket.off(
        "connect",
        handleConnect
      );

      socket.off(
        "disconnect",
        handleDisconnect
      );

      socket.off(
        "current_locks",
        handleCurrentLocks
      );

      socket.off(
        "ticket_locked",
        handleTicketLocked
      );

      socket.off(
        "ticket_unlocked",
        handleTicketUnlocked
      );
    };
  }, [agentName]);

  /* =====================================================
     LOCK TICKET
  ===================================================== */

  const lockTicket = (
    ticketId
  ) => {
    console.log(
      "Requesting lock:",
      ticketId
    );

    socket.emit(
      "lock_ticket",
      {

        ticketId,

        agentName,
      }
    );
  };

  /* =====================================================
     UNLOCK TICKET
  ===================================================== */

  const unlockTicket = (
    ticketId
  ) => {
    console.log(
      "Requesting unlock:",
      ticketId
    );

    socket.emit(
      "unlock_ticket",
      {
        ticketId,
      }
    );
  };

  /* =====================================================
     DASHBOARD STATISTICS
  ===================================================== */

  const stats = useMemo(() => {
    const locked =
      Object.keys(
        locks
      ).length;

    const critical =
      tickets.filter(
        (ticket) =>
          ticket.priority
            ?.toLowerCase() ===
          "critical"
      ).length;

    const open =
      tickets.filter(
        (ticket) =>
          !ticket.status ||
          ticket.status.toLowerCase() ===
            "open"
      ).length;

    return {
      total:
        tickets.length,

      open,

      locked,

      critical,
    };
  }, [
    tickets,
    locks,
  ]);

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="app-shell">

      {/* ================================================
          SIDEBAR
      ================================================ */}

      <Sidebar />

      <div className="main-area">

        {/* ==============================================
            TOPBAR
        ============================================== */}

        <Topbar
          agentName={agentName}
        />

        {/* ==============================================
            CONNECTION STATUS
        ============================================== */}

        <ConnectionStatus
          connected={connected}
        />

        <main className="dashboard-content">

          {/* ============================================
              HERO
          ============================================ */}

          <section className="hero">

            <div>

              <div className="eyebrow">
                OPERATIONS CENTER
              </div>

              <h1>
                Support Queue
              </h1>

              <p>
                Monitor and resolve delivery
                incidents in real time.
              </p>

            </div>

            <div className="live-indicator">
              <span />
              REAL-TIME
            </div>

          </section>

          {/* ============================================
              STATISTICS
          ============================================ */}

          <section className="stats-grid">

            <StatCard
              label="Active tickets"
              value={stats.total}
              detail="Current support queue"
              tone="blue"
              icon={
                <Headphones size={18} />
              }
            />

            <StatCard
              label="Awaiting response"
              value={stats.open}
              detail="Requires attention"
              tone="amber"
              icon={
                <Clock3 size={18} />
              }
            />

            <StatCard
              label="Being handled"
              value={stats.locked}
              detail="Live agent sessions"
              tone="purple"
              icon={
                <CheckCircle2
                  size={18}
                />
              }
            />

            <StatCard
              label="Critical"
              value={stats.critical}
              detail="Priority incidents"
              tone="red"
              icon={
                <AlertTriangle
                  size={18}
                />
              }
            />

          </section>

          {/* ============================================
              ACTIVE TICKETS
          ============================================ */}

          <section className="queue-section">

            <div className="section-header">

              <div>

                <h2>
                  Active incidents
                </h2>

                <p>
                  Changes synchronize instantly
                  across connected agents.
                </p>

              </div>

              <div className="queue-count">
                {tickets.length}{" "}
                {tickets.length === 1
                  ? "ticket"
                  : "tickets"}
              </div>

            </div>

            {/* ==========================================
                EMPTY STATE
            ========================================== */}

            {tickets.length === 0 ? (
              <div className="empty-state">

                <Headphones
                  size={30}
                />

                <h3>
                  No active tickets
                </h3>

                <p>
                  New support incidents
                  will appear here
                  automatically.
                </p>

              </div>
            ) : (

              /* ========================================
                 TICKET GRID
              ======================================== */

              <div className="ticket-grid">

                {tickets.map(
                  (ticket) => (

                    <TicketCard
                      key={ticket._id}

                      ticket={ticket}

                      lock={
                        locks[
                          ticket._id
                        ]
                      }

                      agentName={
                        agentName
                      }

                      onLock={
                        lockTicket
                      }

                      onUnlock={
                        unlockTicket
                      }
                    />

                  )
                )}

              </div>
            )}

          </section>

        </main>

      </div>

    </div>
  );
};

export default Dashboard;
