# Google Tasks Manager

A comprehensive web application for managing Google Tasks with advanced bulk operations, filtering, and automation features.

🔗 **Live Site**: https://googletask-ng5war.manus.space/

---

## Features

### Core Functionality
- **Bulk Insert Tasks** - Add multiple tasks at once from a list
- **Bulk Set Notes** - Update notes for multiple tasks simultaneously
- **Automatic Notes Entry** - Auto-populate task notes from title patterns
- **Due Date Management** - Assign due dates with recurrence patterns
- **Bulk Move** - Move tasks between different task lists
- **Subtasks Management** - Create and manage parent-child task relationships
- **YouTube Playlist Import** - Convert YouTube playlists into tasks

### Advanced Filtering
- **Duration Filtering** - Filter tasks by duration extracted from notes
  - Single value mode (less than, greater than, equal to)
  - Range mode (min/max values)
  - Supports seconds, minutes, hours, days
- **Duplicate Detection** - Find and filter duplicate tasks by title or notes
- **Hierarchy Filtering** - Filter by standalone, parent, or child tasks
- **Date Filtering** - Filter tasks by due date
- **Recurring Task Filtering** - Show/hide recurring tasks

### Sorting Options
- Alphabetical (A-Z, Z-A)
- Creation date (oldest/newest)
- Due date
- Duration (shortest/longest)

---

## Technology Stack

- **Frontend**: React 18 (JavaScript)
- **Build Tool**: Vite
- **Styling**: Custom CSS
- **API**: Google Tasks API
- **Authentication**: Google OAuth 2.0

---

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm package manager
- Google account

### Installation

```bash
# Clone the repository
git clone https://github.com/Sudain-git/google-tasks-manager.git
cd google-tasks-manager

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

### Building for Production

```bash
# Create production build
pnpm run build

# Preview production build
pnpm run preview
```

---

## Configuration

### Google OAuth Setup

The app uses Google OAuth for authentication. Current configuration:
- **Client ID**: `367863809541-6j28nl498c3nu8lsea72v5ie9ovee0mh.apps.googleusercontent.com`
- **API Key**: `AIzaSyCyiaTJQvRxteisE1oB5TB4JHUPEVdq-YE`
- **Authorized Domain**: `googletask-ng5war.manus.space`

To use with a different domain, update the OAuth credentials in Google Cloud Console and modify the constants in `client/src/App.jsx`.

---

## Project Structure

```
google-tasks-manager/
├── client/                    # Frontend application
│   ├── src/
│   │   ├── App.jsx           # Main application (4000+ lines)
│   │   ├── index.css         # Global styles
│   │   └── main.tsx          # Entry point
│   ├── public/               # Static assets
│   └── index.html            # HTML template
├── server/                   # Placeholder (static app)
├── shared/                   # Shared constants
├── package.json              # Dependencies
├── vite.config.ts            # Vite configuration
└── DEVELOPMENT_WORKFLOW.md   # Development guide
```

---

## Usage

### Basic Workflow

1. **Sign in** with your Google account
2. **Select a task list** from the dropdown
3. **Choose a tab** for the operation you want to perform
4. **Configure filters** and options as needed
5. **Execute** the bulk operation

### Example: Assigning Due Dates by Duration

1. Go to **Due Date** tab
2. Select your task list
3. Enable **"Filter by duration (from notes)"**
4. Set **Sort Order** to **"Duration (Shortest)"**
5. Select the tasks you want
6. Set start date and recurrence
7. Click **"Assign Due Dates"**

Tasks will be assigned sequential due dates starting with the shortest duration first.

---

## Development

### Making Changes

See [DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md) for detailed development instructions.

Quick reference:
```bash
# Make changes to code
# Test locally
pnpm run dev

# Build and verify
pnpm run build

# Commit changes
git add .
git commit -m "Description of changes"
git push origin main
```

### Key Files

- `client/src/App.jsx` - Main application logic and UI
- `client/src/index.css` - Styles and theming
- `vite.config.ts` - Build configuration

---

## Features in Detail

### Duration Filter
Extracts duration information from task notes and filters accordingly. Recognizes formats like:
- `5s`, `30 seconds`
- `5min`, `10 minutes`
- `2h`, `1 hour`
- `1d`, `2 days`

### Duplicate Detection
Finds tasks with identical titles or notes based on:
- Case-sensitive or case-insensitive matching
- Exact match comparison
- Configurable search field (title or notes)

### Bulk Operations
All bulk operations include:
- Progress tracking
- Error handling
- Rate limiting to respect API quotas
- Detailed status messages

---

## Known Issues

- OAuth only works on the configured production domain
- Development servers require updating OAuth credentials
- Large task lists may take time to load (API pagination)

---

## Contributing

This is a personal project, but suggestions and bug reports are welcome via GitHub issues.

---

## License

This project is for personal use. Google Tasks API usage is subject to Google's Terms of Service.

---

## Changelog

### Version 0b1c66fd (Current)
- ✅ Fixed creation date sorting bug (oldest/newest reversed)
- ✅ Added duration filter to Due Date tab
- ✅ Added duration sorting (shortest/longest)
- ✅ Added duplicate detection filter to Bulk Move tab
- ✅ Improved filtering and sorting capabilities

### Version cebd019
- Initial project setup
- Core bulk operations implemented
- Basic filtering and sorting

---

## Support

For issues or questions:
- Check [DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md)
- Open a GitHub issue
- Review Google Tasks API documentation

---

**Built with ❤️ for better task management**
