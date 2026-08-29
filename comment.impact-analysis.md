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
```Comment``` table

## API Impact

No need to change any existing APIs

APIs to be added
```HTTP
GET /api/tickets/comments/list
GET /api/tickets/:ticketId/comments
POST /api/tickets/:ticketId/comments
```
## Service Impact

No need to change any exisiting service layers

Need to add a ```comment service``` layer

## Repository/Data Access Impact

No need to change any existing repositories

Need to add ```Comment``` repository

## Authorization Impact

No need to change existing permissions

Need to add permissions for users to comment in their tickets
Need to add permissions for agents to comment in tickets assigned to them
Need to add permissions for admins to comment in any tickets

## Testing Impact

Need to add tests for
- Happy tests
    - Posting comment
    - Retrieving comments by ticketId
    - Retrieving comments with pagination
- Security tests
    - Posting on non owning tickets as user
    - Posting on non assigned tickets by agents
    - Trying to retrieve non owned tickets by users
    - Trying to retrieve non assigned tickets by agents

## Migration Plan

Add Table ```Comment(ticketId, authorId, body, createdAt, updatedAt)```

## Risks

Nothing could break as its just addition of a new feature

## Out of Scope

Do not change any existing APIs and their service layers, Database, routes, controller, etc.
