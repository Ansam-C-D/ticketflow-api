# Impact Analysis

## Existing Request Flow

- **Flow Sequence**: Client -> Docker -> Router -> Middleware -> Controller -> Service -> Repository -> Prisma -> Docker (PostgreSQL Container)

## Database Impact

- **New Tables**: `Comments` and `Status History`.
- **Relations**: Linked to existing `User` and `Ticket` tables via foreign keys.

## API Impact

- **New Endpoints**:
  - `POST /api/tickets/:id/comments`
  - `GET /api/tickets/:id/comments`
  - `/api/tickets/:id/status-history`

## Service Impact

- CommentService
- StatusHistoryService

## Repository/Data Access Impact

- **New Repositories**: `CommentRepository` and `StatusHistoryRepository` handle direct Prisma queries.
- **TicketRepository**: Modified the update method to write a log record to `status_History` when a ticket status changes.

## Authorization Impact

- **Comments**:
  - **ADMIN**: Can view all comments.
  - **AGENT**: Can add and view comments strictly on tickets assigned to them.
  - **USER**: Can add and view comments strictly on tickets they personally created.
- **Status History**:
  - **ADMIN**: Can retrieve full system-wide status history reports.
  - **AGENT**: Can view the status history strictly for tickets assigned to them.
  - **USER**: Can view the status history strictly for tickets they personally created.

## Testing Impact

- **New Test Files**:
  - `comments.integration.spec.ts`: Tests the POST endpoint to create a comment and the GET endpoint to list comments.
  - `status.integration.test.ts`: Tests the paginated GET endpoint to view the ticket status history.

## Migration Plan

- Migrated the `Commnets` table.
- Migrated the `Status_History` table.

## Risks

What could break?

## Out of Scope

What will not be changed?
