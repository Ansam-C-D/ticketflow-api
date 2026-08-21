# Impact Analysis

## Existing Request Flow

Current Application - Admin can create user and agents, User can create tickets, and view their own tickets. Agents and admin can view all tickets. Admin can assign ticket to agents. Admin and agents can update status.

## Database Impact

Create new model for comments and status history

## API Impact

Following endpoints need to be added  
  
```http
POST /api/tickets/:ticketId/comments
GET  /api/tickets/:ticketId/comments
GET /api/tickets/:ticketId/status-history
```

## Service Impact

Create new service for comments(create, view), statusHistory(view)  
Update ticket service for update status to create statusHistory

## Repository/Data Access Impact

Create new repository for comments(create, view), statusHistory(view)  
Update ticket repository for update status to create statusHistory

## Authorization Impact

Most Permissions remain same

## Testing Impact

Added integrations testing for comments and status history

## Migration Plan

Added relations between tickets and users to new added database

## Risks

Proper validation of data recieved from user

## Out of Scope

User module will not be changed
