# Google Tasks Manager - TODO

## Completed Features
- [x] Duration filter in Due Date tab
- [x] Duration sorting in Due Date tab
- [x] Duplicate tasks filter in Bulk Move tab
- [x] Creation date sorting bug fix
- [x] GitHub repository setup
- [x] GitHub Pages deployment

## In Progress
(none)

## Recently Completed
- [x] Expand due date filter in Bulk Move tab to support date ranges and before/after filtering

## Planned Features
(none)

## New Improvements
- [x] Add spacing between date filter radio buttons in Bulk Move tab
- [x] Add due date sorting to Sort by dropdown in Bulk Move tab

## Bug Fixes
- [x] Fix tabs showing dropdowns when not signed in (Due Date, Bulk Move, Subtasks, YouTube List now show sign-in message)

## UI Polish
- [x] Add vertical spacing between due date filter checkbox and radio buttons in Bulk Move tab
- [x] Add top spacing between tabs and container edge

## Authentication Improvements
- [x] Add automatic token refresh handling to prevent session timeouts during long usage
- [x] Update token refresh failure to only update sign-in status indicator instead of forcing sign-out
- [x] Fix inconsistent tab button heights to make them uniform

## New Features
- [x] Rename Tab 8 to "Complete Tasks"
- [x] Add task list dropdown to Complete Tasks tab
- [x] Add search/filter card (same options as Bulk Move) to Complete Tasks tab
- [x] Add filtered tasks display card to Complete Tasks tab
- [x] Add "Mark as Complete" button with progress tracking
- [x] Implement serial task completion with verification
- [x] Add rate limiting and pagination handling for large lists (6k+ tasks)
- [x] Add progress bars and loading indicators
- [x] Rename Tab 8 from "Complete Tasks" to "Bulk Complete"
- [x] Change "Select All on Page" to "Select All" to select all filtered tasks in Bulk Complete tab
- [x] Remove automatic token refresh functionality (causing problems)
- [x] Implement smart token refresh on user interaction (Option 2)
- [x] Add ensureValidToken helper function
- [x] Wrap API calls with token validation
