# Impact Analysis

## Existing Request Flow

Describe the current request flow.
user request a path => controll go to the specified modules router => router calls the controller => servieces => repository functions that intereact with the db.

## Database Impact

Which tables/models need to change?
comments and history tables needs to be crated and migrated.

## API Impact

Which endpoints need to be added or changed?
/ticketId/comments
/ticketId/status-history
are to be added.

## Service Impact

Which services need to change?
comment services and history servies need to be created most of other serviecs remains the same.

## Repository/Data Access Impact

Which repositories need to change?
the ticket repository and the commensts repository needs modification.

## Authorization Impact

Which permissions need to be added or modified?
no permissions are modified.

## Testing Impact

Which tests need to be added?
pagination test for status-history need to be added 

## Migration Plan

What database migration is required?
migration to add models are required.

## Risks

What could break?
comments has no restriction on who can comment

## Out of Scope

What will not be changed?
every workflow other then the comments and history remains unchanged
