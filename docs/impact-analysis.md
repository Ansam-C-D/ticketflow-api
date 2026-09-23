# Impact Analysis

## Existing Request Flow

The application follows this layered architecture:

Request → Routes → Controllers → Services → Repositories → Prisma → PostgreSQL

Routes handle authentication and validation. Controllers pass requests to services. Services enforce business rules and authorization. Repositories handle database operations through Prisma.

The new comments and status-history features will follow this existing flow.

## Database Impact

Update `prisma/schema.prisma` to add two models:

### Comment
- id
- ticketId
- authorId
- body
- createdAt
- updatedAt

Each comment belongs to a ticket and a user (author).

### StatusHistory
- id
- ticketId
- fromStatus
- toStatus
- changedById
- createdAt

Each status-history record belongs to a ticket and the user who changed its status.

Add the required relations to the existing Ticket and User models, along with indexes for querying records by ticket.

## API Impact

Add these authenticated endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/tickets/:ticketId/comments | Create a comment |
| GET | /api/tickets/:ticketId/comments | Retrieve ticket comments |
| GET | /api/tickets/:ticketId/status-history | Retrieve status history |

Update the existing PATCH /api/tickets/:id/status endpoint so every successful status change records a history entry.

Status-history pagination may be implemented as a stretch goal.

## Service Impact

### TicketService
Update changeStatus to preserve existing authorization and transition validation, and record the previous status, new status, and authenticated user.

The status update and history creation must succeed or fail together.

### Comment Service
Add logic to verify the ticket exists, enforce comment permissions, validate comment content, and create or retrieve comments.

### Status-History Service
Add logic to verify the ticket exists, enforce ticket-view authorization, and retrieve history records. Support pagination if implemented.

## Repository/Data Access Impact

Update the ticket repository or create dedicated comment and status-history repositories, following existing project conventions.

Repositories will handle:
- Creating and retrieving comments.
- Retrieving status history for a ticket.
- Persisting status changes and history records atomically.

All database access should use Prisma and remain outside controllers.

## Authorization Impact

All new endpoints must require authentication.

- Users may view comments and status history only for tickets they are permitted to view.
- Comment creation must enforce ticket-level authorization.
- Use the authenticated user's ID as the comment author or status-change actor.
- Do not trust client-supplied author or actor IDs.
- Only valid, authorized status changes should create history records.

Confirm the exact comment-creation permissions against the assignment and existing project conventions before implementation.

## Testing Impact

Add integration tests for:

### Comments
- Successful comment creation and retrieval.
- Unauthenticated requests.
- Invalid comment input.
- Unauthorized access to another user's ticket.
- Nonexistent ticket handling.

### Status History
- History creation after a successful status change.
- Correct fromStatus, toStatus, and changedById values.
- No history entry after a failed status change.
- Authorization when retrieving history.
- Nonexistent ticket handling.
- Pagination, if implemented.

Run the existing test suite to check for regressions.

## Migration Plan

1. Add Comment and StatusHistory models and relations to the Prisma schema.
2. Generate a Prisma migration for the new tables, foreign keys, and indexes.
3. Review the generated migration.
4. Apply the migration to the test database.
5. Verify existing functionality and tests still work.

Preserve the repository's migration workflow and test-database safeguards.

## Risks

- Status and history records may become inconsistent without an atomic transaction.
- Incorrect authorization could expose comments or history for restricted tickets.
- Trusting client-supplied IDs could allow impersonation.
- Foreign-key relationships may affect deletion and test cleanup.
- Schema or migration changes could break existing tests or seeded data.
- Incorrect route registration could conflict with existing endpoints.

## Out of Scope

- Reworking authentication or role definitions.
- Replacing the layered architecture.
- Changing existing status-transition rules.
- Adding unrelated ticket-management features.
- Introducing a new ORM or database.
- Real-time comments, notifications, or file attachments.
- Status-history pagination unless time permits.
