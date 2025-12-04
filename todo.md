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

## Session Timeout Handling
- [x] Detect API errors caused by expired tokens (401/403 errors)
- [x] Update isSignedIn state when token expires
- [x] Show clear message when session expires instead of empty lists

## Bulk Operations Improvements
- [x] Add rate limiting to Bulk Insert (300ms delay between requests)
- [x] Add verification for each task insert before proceeding to next (checks ID and title)
- [ ] Add rate limiting to Bulk Complete (delay between requests) - Tab 8 not in current version
- [ ] Add verification for each task completion before proceeding to next - Tab 8 not in current version
- [x] Handle large batches (1200+ tasks) without errors
