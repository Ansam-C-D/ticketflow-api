# Impact Analysis

## Existing Request Flow

- request first go through express routes and middleware for authentication and validation
- then the controller passes them to service layer for business logic
- repository handles db operations
- response is returned to client

## Database Impact

- add Comment model to store ticket comments.
- add StatusHistory model to track ticket status changes
- update user model and ticket model with reverse relations for comments and status history
-

## API Impact

- add POST /api/tickets/:id/comments to create comments for a ticket
- add GET /api/tickets/:id/comments to read comments of a ticket
- add GET /api/tickets/:id/history to read history of a ticket
- update PATCH /api/tickets/:id/status to automatically log changes to status history after status change

## Service Impact

- Add CommentService to handle comment creation , retrieval and permission checks
- Add HistoryService to handle status history retrieval and permission checks
- Update TicketService to Record status changes in StatusHistory

## Repository/Data Access Impact

- Add CommentRepository to handle comment creation and retrieval
- Add HistoryRepository to handle status history creation and retrieval

## Authorization Impact

- Reuse existinf ticket access permissions for comments and status history

## Testing Impact

- verify POST /api/tickets/:id/comments successfully create comments for a ticket
- verify GET /api/tickets/:id/comments successfully read comments of a ticket
- verify GET /api/tickets/:id/history successfully read history of a ticket
- verify PATCH /api/tickets/:id/status automatically log changes to status history after status change

## Migration Plan

- Create prisma migration to add Comment and StatusHistory tables

## Risks

- exisiting ticket status updates could fail if status history transaction cause error

## Out of Scope

- No changes to user authentication.
- No change to ticket creation , assignment, update, or deletion.
