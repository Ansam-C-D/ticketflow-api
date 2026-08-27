# Impact Analysis

## Existing Request Flow

The application follows a layered architecture:

`Routes -> Controllers -> Services -> Repositories -> Prisma -> PostgreSQL`

Protected ticket routes first pass through authentication middleware. Request validation is handled by the validation middleware.

For ticket status changes:

```
PATCH /api/tickets/:id/status
-> authentication
-> request validation
-> TicketController.changeStatus()
-> TicketService.changeStatus()
-> TicketRepository.update()
-> Prisma
-> PostgreSQL
```

The ticket service performs authorization and validates allowed status transitions before updating the ticket.

## Database Impact

Two new tables are required:

- Comment
- StatusHistory

`Comment` requires:

- id
- ticketId
- authorId
- body
- createdAt
- updatedAt

`StatusHistory` requires:

- id
- ticketId
- fromStatus
- toStatus
- changedById
- createdAt

Both models requires relationships to Ticket and User.

The ticket and User models will also need the corresponding relation fields.

## API Impact

Add:

- POST /api/tickets/:tickedId/comments
- GET /api/tickets/:ticketId/comments
- GET /api/tickets/:ticketId/status-history

Modify:

- PATCH /api/tickets/:id/status

A successfull status change must also create a status-history record.

## Service Impact

Add service layer logic for:

- creating comments
- listing comments
- retrieving status history
- authorization checks

Modify TicketService.changeStatus() so that a successfull status change also records the previous status, new status, and user who made the change.

## Repository/Data Access Impact

Add repository/data-access logic for comments and status history.

The existing TicketRepository status update the flow will need to work with status-history creation so that a successfull status change does not leave the ticket and history data inconsistent.

## Authorization Impact

Comment and status-history access should follow the existing ticket authorization model.

Users shoould only access comments and status history for tickets they are authorized to view.

Comment creation should require the user to be authorized to interact with the ticket.

Existing ADMIN, AGENT and USER roles should be reused rather than creating a new permission system.

## Testing Impact

Add integration tests covering:

- creating comments
- listing comments
- unauthorized comment creation
- status changes creating history
- retrieving status history
- status-history pagination
- authorization

Existing tests must continue to pass.

## Migration Plan

Create a Prisma migration that adds the Comment and StatusHistory models, their relationships to Ticket and User, and any required indexes or constraints.

## Risks

- A successfull ticket status update could occur without its history record.
- An unsuccessfull status change could accidentally create a history record.
- Incorrect authorization could expose another user's comments or histroy
- Existing ticket status-transition behaviour could be broken
- New Prisma relations could affect existing ticket/user queries
- Existing tests could be affected by database changes.

## Out of Scope

- Redesigning the existing application architecture
- Changing authentication
- Creating new user roles
- Unrelated ticket features
- Frontent/UI changes
- Unrelated dependency upgrades
