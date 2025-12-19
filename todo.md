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
- [x] Fix ensureValidToken being called during initial sign-in (causing false "session expired" message)
- [x] Fix ensureValidToken failing during bulk complete (false "session expired" message)
- [x] Remove token validation from bulk operations (causing false "session expired" errors)
- [x] Increase rate limiting delay from 300ms to 500ms for Bulk Insert and Bulk Complete to handle 1200+ task lists
- [x] Simplify verification to only check for ID (title check is now a warning, not an error)
- [x] Revert verification to check title strictly
- [x] Revert rate limiting back to 300ms
- [x] Add 403 error detection and handling (rate limit exceeded)
- [x] Implement adaptive delay algorithm: base 200ms + variable (min 100ms), double on 403, reduce by 10ms on success
- [x] Apply adaptive delay algorithm to Bulk Move tab
- [x] Apply adaptive delay algorithm to Bulk Complete tab
- [x] Fix delay display formatting to show on separate line
- [x] Apply adaptive delay algorithm to Due Date tab
- [x] Fix Due Date verification logic - tasks are updating successfully but verification is failing
- [x] Add adaptive delay algorithm to Bulk Set Notes tab
- [x] Fix 403 error detection in Bulk Set Notes - errors not being caught and retried properly
