# Impact Analysis

## Existing Request Flow

There is only direct interaction with the tickets table and no comments table nor a status history table to know the history of each ticket.

## Database Impact

New tables-comments, status-history
In tickets table no changes needed but update function needs to trigger insertion in the status history table.

## API Impact

    New:

1. POST /api/tickets/:ticketId/comments
2. GET /api/tickets/:ticketId/comments
3. GET /api/tickets/:ticketId/status-history

   Modified:

4. PATCH /api/tickets/:ticketId

## Service Impact

Commnet service:
Need to add the logic for adding comments.
Ticket service:
Need to add a entry to status history table when a status change is made in the ticket table.

## Repository/Data Access Impact

- CommentRepository: Handles database operations for the ticket_comments table.
- StatusHistoryRepository : Handles database operations for the ticket_status_history table.
- TicketRepository: Added a transaction to read and write to history table and update the tickets table.

## Authorization Impact

- AGENTS and USERS can can and view comments and status history for the tickets they are assigned to and the tickets they created respectively.
- ADMINS can view all comments and status history.

## Testing Impact

- Unit tests for comments- GET and POST
- Unit tests for status history GET

## Migration Plan

- Comments table migration
- Status history table migration
