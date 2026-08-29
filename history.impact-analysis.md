# Impact Analysis

## Existing Request Flow

Currently a Request flows through
```text
Main server listener
    ↓
Routes
    ↓
Respective route handler(Eg: AuthRoutes, TicketsRoutes, etc.)
```
And each route handler includes its own implementations of the following layers
```text
Routes (Handling of routes)
    ↓
Controller (Handling of request data and formatting them for internal use)
    ↓
Service (Core Business logic implementation and Security)
    ↓
Repository (Abstracting prisma from internal Service layer)
    ↓
prisma
```
## Database Impact

No modifications need in any existing tables.

Tables to be added
```TicketStatusHistory``` table

## API Impact

No need to change any existing APIs

APIs to be added
```HTTP
GET /api/tickets/:ticketId/status-history
```
## Service Impact

No need to change any exisiting service layers

Need to add a ```status history``` layer

## Repository/Data Access Impact

Need to change existing ```ticket``` repository to insert a record to ```TicketStatusHistory``` table upon any status changes with a transaction

Need to add ```Status history``` repository

## Authorization Impact

No need to change existing permissions

Need to add permissions for users to see status histories of their tickets
Need to add permissions for agents to see histories of tickets assigned to them
Need to add permissions for admins to see histories of any tickets

## Testing Impact

Need to add tests for
- Happy tests
    - Changing a status correctly adds a history record
    - Retrieving status history by ticketId
- Security tests
    - Seeing histories of non owning tickets as user
    - Seeing histories of non assigned tickets by agents
    - Trying to retrieve non owned ticket's histories by users
    - Trying to retrieve non assigned ticket's histories by agents

## Migration Plan

Add Table ```TicketStatusHistory(id, ticketId, fromStatus, toStatus, changedBy, createdAt)```

## Risks

Could break the Ticket status update API

## Out of Scope

Do not change any other repository functionalities in ticket system other than the specified status update repository
