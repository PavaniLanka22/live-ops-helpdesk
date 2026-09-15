import {
  Clock3,
  Lock,
  Pencil,
  UserRound,
} from "lucide-react";

const TicketCard = ({
  ticket,
  lock,
  agentName,
  onLock,
  onUnlock,
}) => {
  /*
    A ticket is locked when a lock object exists.
  */
  const isLocked = Boolean(lock);

  /*
    Determine whether the current agent owns the lock.

    The backend sends:
    {
      ticketId,
      agentName,
      socketId
    }

    We compare the backend agentName with
    the current browser's agentName.
  */
  const isMine =
    isLocked &&
    lock.agentName === agentName;

  /*
    Normalize priority for CSS classes.
  */
  const priority =
    ticket.priority?.toLowerCase() ||
    "medium";

  /*
    Display a human-friendly ticket number.

    Preferred:
      ticket.ticketId

    Fallback:
      last 6 characters of MongoDB _id
  */
  const displayTicketId =
    ticket.ticketId ||
    (ticket._id
      ? ticket._id.slice(-6).toUpperCase()
      : "UNKNOWN");

  return (
    <article
      className={`ticket-card ${
        isLocked && !isMine
          ? "ticket-locked"
          : ""
      } ${
        isMine
          ? "ticket-owned"
          : ""
      }`}
    >
      {/* ================================
          TICKET HEADER
      ================================= */}

      <div className="ticket-card-top">
        <span className="ticket-id">
          #{displayTicketId}
        </span>

        <span
          className={`priority ${priority}`}
        >
          <span />

          {ticket.priority || "Medium"}
        </span>
      </div>

      {/* ================================
          TICKET CONTENT
      ================================= */}

      <div className="ticket-content">
        <h3>
          {ticket.title}
        </h3>

        <p>
          {ticket.description ||
            "No description provided."}
        </p>
      </div>

      {/* ================================
          TICKET META
      ================================= */}

      <div className="ticket-meta">
        <span>
          <UserRound size={13} />

          {ticket.customerName ||
            "Unknown customer"}
        </span>

        <span>
          <Clock3 size={13} />

          {ticket.createdAt
            ? new Date(
                ticket.createdAt
              ).toLocaleDateString()
            : "Today"}
        </span>
      </div>

      {/* =================================================
          CASE 1:
          LOCKED BY ANOTHER AGENT
      ================================================= */}

      {isLocked && !isMine ? (
        <div className="locked-state">
          <div className="lock-symbol">
            <Lock size={16} />
          </div>

          <div>
            <strong>
              Currently being edited
            </strong>

            <span>
              Locked by{" "}
              {lock.agentName ||
                "Another agent"}
            </span>
          </div>
        </div>
      ) : isMine ? (
        /* =================================================
           CASE 2:
           CURRENT AGENT OWNS THE LOCK
        ================================================= */

        <div className="editing-state">
          <div className="editing-label">
            <span className="editing-dot" />

            You are editing this ticket
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              onUnlock(ticket._id)
            }
          >
            Release ticket
          </button>
        </div>
      ) : (
        /* =================================================
           CASE 3:
           TICKET IS AVAILABLE
        ================================================= */

        <button
          type="button"
          className="edit-button"
          onClick={() =>
            onLock(ticket._id)
          }
        >
          <Pencil size={15} />

          Open ticket
        </button>
      )}
    </article>
  );
};

export default TicketCard;