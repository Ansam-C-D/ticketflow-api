# Impact Analysis

## Existing Request Flow

- Request first go through express routes and middleware for authentication.
- Then controller passes them to service layer for business logic.
- Repository handles db operations.
- Response is returned back to the client.

## Database Impact

- Add comment model to store ticket comments.
- Add StatusHistory model to track ticket status changes.
- Update User and ticket model with reverse relations for comments and status history

## API Impact

- Add `POST /api/tickets/:ticketid/comments ` to create comment for a ticket.
- Add `GET /api/tickets/:ticketId/comments` to retrieve all comments for a ticket.
- Add `GET /api/tickets/:ticketId/status-history` to read status history of a ticket.
- Update `PATCH /api/tickets/:ticketId/status` to automatically log changes to status history after status changes.

## Service Impact

- Add CommentService to handle comment creation , retrieval and permission checks.
- Add HistoryService to handle status history retrieval and permission checks.
- Update TicketService to record status changes in StatusHistory.

## Repository/Data Access Impact

- Add CommentRepository to handle comment creation and retrieval.
- Add HistoryRepository to handle status history creation and retrieval.

## Authorization Impact

- Reused existing ticket access permission for comments and status history

## Testing Impact

- Verify `POST /api/tickets/ticketId/comments` successfully create comments for a ticket.
- Verify `GET /api/tickets/:ticketId/comments` successfully read comments of a ticket.
- Verify `GET /api/tickets/:ticketId/history` successfully read history of a ticket
- Verify `PATCH /api/tickets/:ticketId/status` automatically log changes to status history after status change

## Migration Plan

- Create prisma migration to add Comment and StatusHistory tables

## Risks

- Existing ticket status updates could fail if status history transaction cause error

## Out of Scope

- No change to user authentication
- No change to ticket creation,assignment,update or deletion
