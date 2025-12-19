import React, { useState, useEffect } from 'react';
// import './App.css'; // CSS removed

// Configuration - Google API credentials
const CLIENT_ID = '367863809541-6j28nl498c3nu8lsea72v5ie9ovee0mh.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCyiaTJQvRxteisE1oB5TB4JHUPEVdq-YE';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest';
const SCOPES = 'https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/youtube.readonly';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initError, setInitError] = useState(null);
  
  // Bulk Insert state
  const [taskLists, setTaskLists] = useState([]);
  const [selectedTaskList, setSelectedTaskList] = useState('');
  const [bulkTasksText, setBulkTasksText] = useState('');
  const [isInserting, setIsInserting] = useState(false);
  const [insertProgress, setInsertProgress] = useState({ current: 0, total: 0 });
  const [insertStatus, setInsertStatus] = useState('');

  // Bulk Set Notes state
  const [selectedNotesTaskList, setSelectedNotesTaskList] = useState('');
  const [taskNamesText, setTaskNamesText] = useState('');
  const [notesText, setNotesText] = useState('');
  const [isSettingNotes, setIsSettingNotes] = useState(false);
  const [notesProgress, setNotesProgress] = useState({ current: 0, total: 0 });
  const [notesStatus, setNotesStatus] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);

  // Automatic Notes Entry state
  const [selectedAutoNotesTaskList, setSelectedAutoNotesTaskList] = useState('');
  const [autoNotesTasksPreview, setAutoNotesTasksPreview] = useState([]);
  const [isProcessingAutoNotes, setIsProcessingAutoNotes] = useState(false);
  const [autoNotesProgress, setAutoNotesProgress] = useState({ current: 0, total: 0 });
  const [autoNotesStatus, setAutoNotesStatus] = useState('');
  const [isLoadingTasksPreview, setIsLoadingTasksPreview] = useState(false);

  // Due Date Management state
  const [selectedDueDateTaskList, setSelectedDueDateTaskList] = useState('');
  const [dueDateTasks, setDueDateTasks] = useState([]);
  const [isLoadingDueDateTasks, setIsLoadingDueDateTasks] = useState(false);
  const [dueDateSearchTerm, setDueDateSearchTerm] = useState('');
  const [dueDateCaseSensitive, setDueDateCaseSensitive] = useState(true);
  const [dueDateSortBy, setDueDateSortBy] = useState('alphabetical');
  const [dueDateSortField, setDueDateSortField] = useState('title'); // 'title' or 'notes'
  const [dueDateTaskTypeFilter, setDueDateTaskTypeFilter] = useState('all'); // 'all', 'parent', 'child', 'standalone'
  const [dueDateHierarchyFilter, setDueDateHierarchyFilter] = useState('all');
  const [dueDateHideTasksWithDueDates, setDueDateHideTasksWithDueDates] = useState(false);
  const [dueDateSelectedTasks, setDueDateSelectedTasks] = useState([]);
  const [dueDateStartDate, setDueDateStartDate] = useState('');
  const [dueDateRecurrenceType, setDueDateRecurrenceType] = useState('none');
  const [dueDateRecurrenceInterval, setDueDateRecurrenceInterval] = useState(1);
  const [isAssigningDueDates, setIsAssigningDueDates] = useState(false);
  const [dueDateAssignmentProgress, setDueDateAssignmentProgress] = useState({ current: 0, total: 0 });
  const [dueDateAssignmentStatus, setDueDateAssignmentStatus] = useState('');
  const [dueDateDurationFilter, setDueDateDurationFilter] = useState({
    enabled: false,
    mode: 'single', // 'single' or 'range'
    value: '',
    valueMin: '',
    valueMax: '',
    unit: 'seconds',
    operator: 'less'
  });

  // Subtasks Management state
  const [selectedSubtasksTaskList, setSelectedSubtasksTaskList] = useState('');
  const [subtasksTasks, setSubtasksTasks] = useState([]);
  const [isLoadingSubtasksTasks, setIsLoadingSubtasksTasks] = useState(false);
  const [subtasksSearchTerm, setSubtasksSearchTerm] = useState('');
  const [subtasksCaseSensitive, setSubtasksCaseSensitive] = useState(true);
  const [subtasksSortBy, setSubtasksSortBy] = useState('alphabetical');
  const [subtasksCurrentPage, setSubtasksCurrentPage] = useState(1);
  const [subtasksSelectedTasks, setSubtasksSelectedTasks] = useState([]);
  const [subtasksParentTask, setSubtasksParentTask] = useState(null);
  const [subtasksChildrenOrder, setSubtasksChildrenOrder] = useState([]);
  const [isSettingRelationships, setIsSettingRelationships] = useState(false);
  const [relationshipProgress, setRelationshipProgress] = useState({ current: 0, total: 0 });
  const [relationshipStatus, setRelationshipStatus] = useState('');

  // Bulk Move state
  const [bulkMoveSourceList, setBulkMoveSourceList] = useState('');
  const [bulkMoveDestinationList, setBulkMoveDestinationList] = useState('');
  const [bulkMoveTasks, setBulkMoveTasks] = useState([]);
  const [isLoadingBulkMoveTasks, setIsLoadingBulkMoveTasks] = useState(false);
  const [bulkMoveSearchTerm, setBulkMoveSearchTerm] = useState('');
  const [bulkMoveCaseSensitive, setBulkMoveCaseSensitive] = useState(true);
  const [bulkMoveSortBy, setBulkMoveSortBy] = useState('alphabetical');
  const [bulkMoveCurrentPage, setBulkMoveCurrentPage] = useState(1);
  const [bulkMoveSelectedTasks, setBulkMoveSelectedTasks] = useState([]);
  const [bulkMoveActivePreset, setBulkMoveActivePreset] = useState('');
  const [isMovingTasks, setIsMovingTasks] = useState(false);
  const [moveProgress, setMoveProgress] = useState({ current: 0, total: 0 });
  const [moveStatus, setMoveStatus] = useState('');
  const [bulkMoveDurationFilter, setBulkMoveDurationFilter] = useState({
    enabled: false,
    mode: 'single', // 'single' or 'range'
    value: '',
    valueMin: '',
    valueMax: '',
    unit: 'seconds',
    operator: 'less'
  });
  const [bulkMoveOmitRecurring, setBulkMoveOmitRecurring] = useState(true);
  const [bulkMoveHierarchyFilter, setBulkMoveHierarchyFilter] = useState({
    standalone: true,
    parent: true,
    child: true
  });
  const [bulkMoveDateFilter, setBulkMoveDateFilter] = useState({
    enabled: false,
    mode: 'exact', // 'exact', 'before', 'after', 'range'
    date: '', // for exact, before, after modes
    dateStart: '', // for range mode
    dateEnd: '' // for range mode
  });
  const [bulkMoveShowDuplicates, setBulkMoveShowDuplicates] = useState(false);
  const [bulkMoveSortField, setBulkMoveSortField] = useState('title'); // 'title' or 'notes'

  // YouTube Playlist to Task state
  const [youtubeTaskList, setYoutubeTaskList] = useState('');
  const [youtubePlaylistUrl, setYoutubePlaylistUrl] = useState('');
  const [isProcessingPlaylist, setIsProcessingPlaylist] = useState(false);
  const [playlistProgress, setPlaylistProgress] = useState({ current: 0, total: 0 });
  const [playlistStatus, setPlaylistStatus] = useState('');

  // Complete Tasks state
  const [completeTasksList, setCompleteTasksList] = useState('');
  const [completeTasks, setCompleteTasks] = useState([]);
  const [isLoadingCompleteTasks, setIsLoadingCompleteTasks] = useState(false);
  const [completeSearchTerm, setCompleteSearchTerm] = useState('');
  const [completeCaseSensitive, setCompleteCaseSensitive] = useState(true);
  const [completeSortBy, setCompleteSortBy] = useState('alphabetical');
  const [completeCurrentPage, setCompleteCurrentPage] = useState(1);
  const [completeSelectedTasks, setCompleteSelectedTasks] = useState([]);
  const [completeActivePreset, setCompleteActivePreset] = useState('');
  const [isCompletingTasks, setIsCompletingTasks] = useState(false);
  const [completeProgress, setCompleteProgress] = useState({ current: 0, total: 0 });
  const [completeStatus, setCompleteStatus] = useState('');
  const [completeDurationFilter, setCompleteDurationFilter] = useState({
    enabled: false,
    mode: 'single',
    value: '',
    valueMin: '',
    valueMax: '',
    unit: 'seconds',
    operator: 'less'
  });
  const [completeOmitRecurring, setCompleteOmitRecurring] = useState(true);
  const [completeHierarchyFilter, setCompleteHierarchyFilter] = useState({
    standalone: true,
    parent: true,
    child: true
  });
  const [completeDateFilter, setCompleteDateFilter] = useState({
    enabled: false,
    mode: 'exact',
    date: '',
    dateStart: '',
    dateEnd: ''
  });
  const [completeShowDuplicates, setCompleteShowDuplicates] = useState(false);
  const [completeSortField, setCompleteSortField] = useState('title');

  // Initialize Google API
  useEffect(() => {
    const initializeGapi = async () => {
      try {
        console.log('Starting Google API initialization...');
        
        // Load both Google API scripts
        await Promise.all([
          loadGoogleAPI(),
          loadGoogleIdentityServices()
        ]);
        
        console.log('Scripts loaded, initializing...');
        
        // Initialize the API
        await initGapi();
        
        console.log('Google API initialization complete');
      } catch (error) {
        console.error('Error initializing Google API:', error);
        setInitError(error.message);
        setIsInitialized(true);
      }
    };

    const loadGoogleAPI = () => {
      return new Promise((resolve, reject) => {
        if (window.gapi) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const loadGoogleIdentityServices = () => {
      return new Promise((resolve, reject) => {
        if (window.google) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initGapi = async () => {
      return new Promise((resolve, reject) => {
        window.gapi.load('auth2:client', async () => {
          try {
            console.log('Initializing gapi client...');
            
            await window.gapi.client.init({
              apiKey: API_KEY,
              clientId: CLIENT_ID,
              discoveryDocs: [DISCOVERY_DOC],
              scope: SCOPES
            });

            console.log('gapi client initialized');

            const authInstance = window.gapi.auth2.getAuthInstance();
            if (authInstance) {
              setIsSignedIn(authInstance.isSignedIn.get());
              // Listen for sign-in state changes
              authInstance.isSignedIn.listen(setIsSignedIn);
              console.log('Auth instance ready, signed in:', authInstance.isSignedIn.get());
            }
            
            setIsInitialized(true);
            resolve();
          } catch (error) {
            console.error('gapi init error:', error);
            reject(error);
          }
        });
      });
    };

    // Set a timeout to show the interface even if gapi fails to load
    const timeout = setTimeout(() => {
      if (!isInitialized) {
        console.log('Google API initialization timed out');
        setInitError('Google API initialization timed out. Please refresh the page.');
        setIsInitialized(true);
      }
    }, 15000);

    initializeGapi();

    return () => {
      clearTimeout(timeout);
    };
  }, []);



  // Load task lists when user signs in
  useEffect(() => {
    if (isSignedIn) {
      loadTaskLists();
    } else {
      setTaskLists([]);
      setSelectedTaskList('');
      setSelectedNotesTaskList('');
      setSelectedAutoNotesTaskList('');
      setAutoNotesTasksPreview([]);
    }
  }, [isSignedIn]);

  // Smart token refresh - check and refresh token only when user takes action
  const ensureValidToken = async () => {
    const authInstance = window.gapi?.auth2?.getAuthInstance();
    if (!authInstance || !authInstance.isSignedIn.get()) {
      console.log('ensureValidToken: Not signed in or no auth instance');
      setIsSignedIn(false);
      return false;
    }
    
    try {
      const currentUser = authInstance.currentUser.get();
      if (!currentUser) {
        console.log('ensureValidToken: No current user');
        return true; // Assume valid if we can't check
      }
      
      const authResponse = currentUser.getAuthResponse(true);
      if (!authResponse || !authResponse.expires_at) {
        console.log('ensureValidToken: No auth response or expires_at, assuming valid');
        return true; // Assume valid if we can't get expiration
      }
      
      const expiresAt = authResponse.expires_at;
      const now = Date.now();
      
      // If token expires in less than 5 minutes, refresh it
      if (expiresAt < (now + 5 * 60 * 1000)) {
        console.log('Token expiring soon, refreshing...');
        await currentUser.reloadAuthResponse();
        console.log('Token refreshed successfully');
      }
      
      return true;
    } catch (error) {
      console.error('Token validation/refresh failed:', error);
      // Don't set isSignedIn to false on error - just allow the API call to proceed
      // The API call itself will fail if the token is actually invalid
      console.log('Proceeding with API call despite token check error');
      return true;
    }
  };

  // Wrapper for API calls that ensures token is valid
  const safeApiCall = async (apiFunction, errorMessage = 'Your session has expired. Please sign in again.') => {
    const tokenValid = await ensureValidToken();
    if (!tokenValid) {
      alert(errorMessage);
      throw new Error('Token expired');
    }
    return await apiFunction();
  };

  const handleSignIn = async () => {
    try {
      console.log('Sign in button clicked');
      
      // Try Google Identity Services first (newer method)
      if (window.google && window.google.accounts) {
        console.log('Trying Google Identity Services...');
        try {
          await signInWithGoogleIdentity();
          return;
        } catch (gisError) {
          console.log('Google Identity Services failed, trying gapi auth2...', gisError);
        }
      }
      
      // Fallback to gapi auth2
      if (!window.gapi) {
        alert('Google API not loaded. Please refresh the page and try again.');
        return;
      }
      
      if (!window.gapi.auth2) {
        alert('Google Auth not initialized. Please refresh the page and try again.');
        return;
      }
      
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (!authInstance) {
        alert('Auth instance not available. Please refresh the page and try again.');
        return;
      }
      
      console.log('Attempting to sign in with gapi auth2...');
      const result = await authInstance.signIn();
      console.log('Sign in successful:', result);
      setInitError(null); // Clear any previous errors
      
    } catch (error) {
      console.error('Error signing in:', error);
      
      if (error.error === 'popup_blocked_by_browser') {
        alert('Please allow popups for this site and try again.');
      } else if (error.error === 'access_denied') {
        alert('Access denied. Please try signing in again.');
      } else if (error.error === 'popup_closed_by_user') {
        alert('Sign in was cancelled. Please try again.');
      } else {
        alert('Sign in failed: ' + (error.details || error.error || error.message || 'Unknown error'));
      }
    }
  };

  const signInWithGoogleIdentity = () => {
    return new Promise((resolve, reject) => {
      window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response) => {
          if (response.error) {
            reject(response);
          } else {
            console.log('Google Identity Services sign in successful:', response);
            // Set the access token for gapi
            window.gapi.client.setToken({access_token: response.access_token});
            setIsSignedIn(true);
            setInitError(null); // Clear any previous errors
            resolve(response);
          }
        },
      }).requestAccessToken();
    });
  };

  const handleSignOut = async () => {
    try {
      if (!window.gapi || !window.gapi.auth2) {
        return;
      }
      const authInstance = window.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      setTasks([]);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const loadTaskLists = async () => {
    if (!isSignedIn || !window.gapi || !window.gapi.client) {
      console.log('Cannot load task lists: not signed in or API not ready');
      return;
    }
    
    const executeLoad = async () => {
      console.log('Loading task lists...');
      const response = await window.gapi.client.tasks.tasklists.list();
      const lists = response.result.items || [];
      setTaskLists(lists);
      
      // Auto-select the first list if none selected
      if (lists.length > 0 && !selectedTaskList) {
        setSelectedTaskList(lists[0].id);
      }
      if (lists.length > 0 && !selectedNotesTaskList) {
        setSelectedNotesTaskList(lists[0].id);
      }
      if (lists.length > 0 && !selectedAutoNotesTaskList) {
        setSelectedAutoNotesTaskList(lists[0].id);
      }
      
      console.log('Task lists loaded:', lists.length);
      return lists;
    };
    
    try {
      await executeLoad();
    } catch (error) {
      console.error('Error loading task lists:', error);
      setInsertStatus('Failed to load task lists: ' + error.message);
    }
  };

  const loadTasks = async () => {
    if (!isSignedIn || !window.gapi || !window.gapi.client) {
      alert('Please sign in first and ensure Google API is loaded.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await window.gapi.client.tasks.tasks.list({
        tasklist: selectedTaskList || '@default'
      });
      setTasks(response.result.items || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
      alert('Failed to load tasks: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Due Date Management Functions
  const loadDueDateTasks = async (taskListId) => {
    if (!isSignedIn || !window.gapi || !window.gapi.client || !taskListId) {
      console.log('Cannot load tasks: not signed in, API not ready, or no task list selected');
      return;
    }
    
    setIsLoadingDueDateTasks(true);
    try {
      console.log('Loading tasks for due date management...');
      let allTasks = [];
      let pageToken = null;
      
      // Fetch all pages of tasks
      do {
        const response = await window.gapi.client.tasks.tasks.list({
          tasklist: taskListId,
          maxResults: 100,
          showCompleted: false,
          showHidden: false,
          pageToken: pageToken
        });
        
        const tasks = response.result.items || [];
        allTasks = allTasks.concat(tasks);
        pageToken = response.result.nextPageToken;
        
        // Rate limiting between page requests
        if (pageToken) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } while (pageToken);
      
      setDueDateTasks(allTasks);
      console.log(`Loaded ${allTasks.length} tasks for due date management`);
    } catch (error) {
      console.error('Error loading tasks for due date management:', error);
      setDueDateTasks([]);
    } finally {
      setIsLoadingDueDateTasks(false);
    }
  };

  // Load tasks when Due Date task list changes
  useEffect(() => {
    if (selectedDueDateTaskList) {
      loadDueDateTasks(selectedDueDateTaskList);
    } else {
      setDueDateTasks([]);
      setDueDateSelectedTasks([]);
    }
  }, [selectedDueDateTaskList]);

  // Filter and sort Due Date tasks
  const getFilteredDueDateTasks = () => {
    let filtered = [...dueDateTasks];

    // Apply search filter
    if (dueDateSearchTerm.trim()) {
      const searchTerm = dueDateCaseSensitive 
        ? dueDateSearchTerm.trim() 
        : dueDateSearchTerm.trim().toLowerCase();
      
      filtered = filtered.filter(task => {
        const taskTitle = dueDateCaseSensitive 
          ? task.title 
          : task.title.toLowerCase();
        return taskTitle.includes(searchTerm);
      });
    }

    // Apply task type filter
    if (dueDateTaskTypeFilter !== 'all') {
      const taskIds = new Set(filtered.map(task => task.id));
      const parentIds = new Set(filtered.filter(task => task.parent).map(task => task.parent));
      const tasksWithChildren = new Set(filtered.filter(task => parentIds.has(task.id)).map(task => task.id));

      if (dueDateTaskTypeFilter === 'parent') {
        filtered = filtered.filter(task => tasksWithChildren.has(task.id));
      } else if (dueDateTaskTypeFilter === 'child') {
        filtered = filtered.filter(task => task.parent && taskIds.has(task.parent));
      } else if (dueDateTaskTypeFilter === 'standalone') {
        filtered = filtered.filter(task => !task.parent && !tasksWithChildren.has(task.id));
      }
    }

    // Apply duration filter
    if (dueDateDurationFilter.enabled) {
      const parseDurationFromNotes = (notes) => {
        if (!notes) return null;
        const noteText = notes.trim();
        const startOfNotes = noteText.substring(0, 50).toLowerCase();
        const patterns = [
          /^(\d+\.?\d*)\s*s(?:ec(?:ond)?)?s?\s*[-\s]/i,
          /^(\d+\.?\d*)\s*min(?:ute)?s?\s*[-\s]/i,
          /^(\d+\.?\d*)\s*m\s*[-\s]/i,
          /^(\d+\.?\d*)\s*h(?:our)?s?\s*[-\s]/i,
          /^(\d+\.?\d*)\s*d(?:ay)?s?\s*[-\s]/i,
          /^(\d+\.?\d*)\s*w(?:eek)?s?\s*[-\s]/i,
          /^(\d+\.?\d*)\s*mo(?:nth)?s?\s*[-\s]/i
        ];
        const unitMultipliers = {
          's': 1, 'sec': 1, 'second': 1,
          'm': 60, 'min': 60, 'minute': 60,
          'h': 3600, 'hour': 3600,
          'd': 86400, 'day': 86400,
          'w': 604800, 'week': 604800,
          'mo': 2592000, 'month': 2592000
        };
        for (const pattern of patterns) {
          const match = startOfNotes.match(pattern);
          if (match) {
            const value = parseFloat(match[1]);
            let unit = match[0].replace(/[\d\s.\-]/g, '').toLowerCase();
            if (unit.startsWith('sec') || unit === 's') unit = 's';
            else if (unit.startsWith('min')) unit = 'minute';
            else if (unit === 'm') unit = 'm';
            else if (unit.startsWith('h')) unit = 'hour';
            else if (unit.startsWith('d')) unit = 'day';
            else if (unit.startsWith('w')) unit = 'week';
            else if (unit.startsWith('mo')) unit = 'month';
            const multiplier = unitMultipliers[unit] || 1;
            return value * multiplier;
          }
        }
        return null;
      };

      const unitMultipliers = {
        'seconds': 1,
        'minutes': 60,
        'hours': 3600,
        'days': 86400
      };
      
      if (dueDateDurationFilter.mode === 'range' && dueDateDurationFilter.valueMin && dueDateDurationFilter.valueMax) {
        const filterMinSeconds = parseFloat(dueDateDurationFilter.valueMin) * (unitMultipliers[dueDateDurationFilter.unit] || 1);
        const filterMaxSeconds = parseFloat(dueDateDurationFilter.valueMax) * (unitMultipliers[dueDateDurationFilter.unit] || 1);
        filtered = filtered.filter(task => {
          const taskDurationSeconds = parseDurationFromNotes(task.notes);
          if (taskDurationSeconds === null) return false;
          return taskDurationSeconds >= filterMinSeconds && taskDurationSeconds <= filterMaxSeconds;
        });
      } else if (dueDateDurationFilter.mode === 'single' && dueDateDurationFilter.value) {
        const filterValue = parseFloat(dueDateDurationFilter.value);
        const filterSeconds = filterValue * (unitMultipliers[dueDateDurationFilter.unit] || 1);
        filtered = filtered.filter(task => {
          const taskDurationSeconds = parseDurationFromNotes(task.notes);
          if (taskDurationSeconds === null) return false;
          switch (dueDateDurationFilter.operator) {
            case 'less':
              return taskDurationSeconds < filterSeconds;
            case 'greater':
              return taskDurationSeconds > filterSeconds;
            case 'equal':
              return Math.abs(taskDurationSeconds - filterSeconds) < 0.01;
            default:
              return true;
          }
        });
      }
    }

    // Apply due date filter
    if (dueDateHideTasksWithDueDates) {
      filtered = filtered.filter(task => !task.due);
    }

    // Apply sorting based on field and order
    filtered.sort((a, b) => {
      let compareValue = 0;
      
      // Determine which field to sort by
      if (dueDateSortField === 'notes') {
        if (dueDateSortBy === 'alphabetical') {
          compareValue = (a.notes || '').localeCompare(b.notes || '');
        } else if (dueDateSortBy === 'alphabetical-desc') {
          compareValue = (b.notes || '').localeCompare(a.notes || '');
        }
      } else { // title
        if (dueDateSortBy === 'alphabetical') {
          compareValue = a.title.localeCompare(b.title);
        } else if (dueDateSortBy === 'alphabetical-desc') {
          compareValue = b.title.localeCompare(a.title);
        }
      }
      
      // Handle other sort types
      if (dueDateSortBy === 'creation-date') {
        compareValue = (b.position || '').localeCompare(a.position || ''); // Oldest first (higher position = older)
      } else if (dueDateSortBy === 'creation-date-desc') {
        compareValue = (a.position || '').localeCompare(b.position || ''); // Newest first (lower position = newer)
      } else if (dueDateSortBy === 'due-date') {
        if (!a.due && !b.due) compareValue = 0;
        else if (!a.due) compareValue = 1;
        else if (!b.due) compareValue = -1;
        else compareValue = new Date(a.due) - new Date(b.due);
      } else if (dueDateSortBy === 'due-date-desc') {
        if (!a.due && !b.due) compareValue = 0;
        else if (!a.due) compareValue = 1;
        else if (!b.due) compareValue = -1;
        else compareValue = new Date(b.due) - new Date(a.due);
      } else if (dueDateSortBy === 'duration' || dueDateSortBy === 'duration-desc') {
        // Parse duration from notes for both tasks
        const parseDurationFromNotes = (notes) => {
          if (!notes) return null;
          const noteText = notes.trim();
          const startOfNotes = noteText.substring(0, 50).toLowerCase();
          const patterns = [
            /^(\d+\.?\d*)\s*s(?:ec(?:ond)?)?s?\s*[-\s]/i,
            /^(\d+\.?\d*)\s*min(?:ute)?s?\s*[-\s]/i,
            /^(\d+\.?\d*)\s*m\s*[-\s]/i,
            /^(\d+\.?\d*)\s*h(?:our)?s?\s*[-\s]/i,
            /^(\d+\.?\d*)\s*d(?:ay)?s?\s*[-\s]/i,
            /^(\d+\.?\d*)\s*w(?:eek)?s?\s*[-\s]/i,
            /^(\d+\.?\d*)\s*mo(?:nth)?s?\s*[-\s]/i
          ];
          const unitMultipliers = {
            's': 1, 'sec': 1, 'second': 1,
            'm': 60, 'min': 60, 'minute': 60,
            'h': 3600, 'hour': 3600,
            'd': 86400, 'day': 86400,
            'w': 604800, 'week': 604800,
            'mo': 2592000, 'month': 2592000
          };
          for (const pattern of patterns) {
            const match = startOfNotes.match(pattern);
            if (match) {
              const value = parseFloat(match[1]);
              let unit = match[0].replace(/[\d\s.\-]/g, '').toLowerCase();
              if (unit.startsWith('sec') || unit === 's') unit = 's';
              else if (unit.startsWith('min')) unit = 'minute';
              else if (unit === 'm') unit = 'm';
              else if (unit.startsWith('h')) unit = 'hour';
              else if (unit.startsWith('d')) unit = 'day';
              else if (unit.startsWith('w')) unit = 'week';
              else if (unit.startsWith('mo')) unit = 'month';
              const multiplier = unitMultipliers[unit] || 1;
              return value * multiplier;
            }
          }
          return null;
        };
        
        const aDuration = parseDurationFromNotes(a.notes);
        const bDuration = parseDurationFromNotes(b.notes);
        
        // Tasks without duration go to the end
        if (aDuration === null && bDuration === null) compareValue = 0;
        else if (aDuration === null) compareValue = 1;
        else if (bDuration === null) compareValue = -1;
        else {
          if (dueDateSortBy === 'duration') {
            compareValue = aDuration - bDuration; // Shortest first
          } else {
            compareValue = bDuration - aDuration; // Longest first
          }
        }
      }
      
      return compareValue;
    });

    return filtered;
  };

  const toggleTaskSelection = (task) => {
    setDueDateSelectedTasks(prev => {
      const isSelected = prev.some(t => t.id === task.id);
      if (isSelected) {
        return prev.filter(t => t.id !== task.id);
      } else {
        return [...prev, task];
      }
    });
  };

  const selectAllFilteredTasks = () => {
    const filtered = getFilteredDueDateTasks();
    setDueDateSelectedTasks(filtered);
  };

  const clearAllSelectedTasks = () => {
    setDueDateSelectedTasks([]);
  };

  // Generate dates based on frequency settings
  const generateDueDates = (startDate, frequencyType, interval, taskCount) => {
    const dates = [];
    let currentDate = new Date(startDate);
    
    for (let i = 0; i < taskCount; i++) {
      let dateToAdd = new Date(currentDate);
      dates.push(new Date(dateToAdd));
      
      // Calculate next date based on frequency type
      if (i < taskCount - 1) {
        if (frequencyType === 'daily') {
          currentDate.setDate(currentDate.getDate() + interval);
        } else if (frequencyType === 'weekly') {
          currentDate.setDate(currentDate.getDate() + (interval * 7));
        } else if (frequencyType === 'monthly') {
          currentDate.setMonth(currentDate.getMonth() + interval);
        }
      }
    }
    
    return dates;
  };

  // Update a single task's due date
  const updateTaskDueDate = async (taskId, taskListId, dueDate) => {
    try {
      console.log(`Updating task ${taskId} with due date: ${dueDate.toISOString()}`);
      
      const response = await window.gapi.client.tasks.tasks.patch({
        tasklist: taskListId,
        task: taskId,
        resource: {
          due: dueDate.toISOString()
        }
      });
      
      console.log('Task due date updated successfully:', response.result);
      return response.result;
    } catch (error) {
      console.error('Error updating task due date:', error);
      throw error;
    }
  };

  // Handle bulk due date assignment
  const handleDueDateAssignment = async () => {
    if (!dueDateStartDate || dueDateSelectedTasks.length === 0) {
      alert('Please select a start date and at least one task.');
      return;
    }

    const tasksToProcess = dueDateSelectedTasks;
    
    setIsAssigningDueDates(true);
    setDueDateAssignmentProgress({ current: 0, total: tasksToProcess.length });
    setDueDateAssignmentStatus('Generating due dates...');

    try {
      // Generate the due dates
      const dueDates = generateDueDates(
        dueDateStartDate,
        dueDateRecurrenceType,
        dueDateRecurrenceInterval,
        tasksToProcess.length
      );

      setDueDateAssignmentStatus('Assigning due dates to tasks...');

      const results = [];
      const errors = [];
      const baseDelay = 200; // Base delay in ms (constant)
      let variableDelay = 100; // Variable delay in ms (min 100ms)
      const minVariableDelay = 100;
      const updatedTasks = []; // Track updated task IDs for verification

      // Process tasks one by one with adaptive delay
      for (let i = 0; i < tasksToProcess.length; i++) {
        const task = tasksToProcess[i];
        const dueDate = dueDates[i];
        let taskUpdated = false;
        
        while (!taskUpdated) {
          try {
            const totalDelay = baseDelay + variableDelay;
            setDueDateAssignmentProgress({ current: i + 1, total: tasksToProcess.length });
            setDueDateAssignmentStatus(`Updating task ${i + 1} of ${tasksToProcess.length}: ${task.title}\n(delay: ${totalDelay}ms = ${baseDelay}+${variableDelay})`);

            const result = await updateTaskDueDate(task.id, selectedDueDateTaskList, dueDate);
            
            // Verify the update was successful
            if (result && result.id) {
              updatedTasks.push({ id: task.id, title: task.title, index: i });
              results.push({
                task: task,
                dueDate: dueDate,
                success: true,
                result: result
              });
              taskUpdated = true;
              console.log(`Successfully updated task: ${task.title} with due date: ${dueDate.toLocaleDateString()}`);
              
              // On success: reduce variable delay by 10ms (linear decrease, min 100ms)
              variableDelay = Math.max(variableDelay - 10, minVariableDelay);
            } else {
              throw new Error('Update did not return expected result');
            }

            // Add delay between requests
            if (i < tasksToProcess.length - 1) {
              await new Promise(resolve => setTimeout(resolve, baseDelay + variableDelay));
            }
            
          } catch (error) {
            // Check if it's a 403 quota exceeded error
            if (error.status === 403 || error.code === 403 || 
                (error.result && error.result.code === 403) ||
                (error.message && (error.message.toLowerCase().includes('quota') || error.message.toLowerCase().includes('rate limit')))) {
              // Double the variable delay
              variableDelay = variableDelay * 2;
              console.warn(`403 quota exceeded. Doubling variable delay to ${variableDelay}ms (total: ${baseDelay + variableDelay}ms)`);
              
              // Verify previous task if it exists
              if (updatedTasks.length > 0) {
                const prevTask = updatedTasks[updatedTasks.length - 1];
                console.log(`Verifying previous task: ${prevTask.title}`);
                try {
                  const verifyResponse = await window.gapi.client.tasks.tasks.get({
                    tasklist: selectedDueDateTaskList,
                    task: prevTask.id
                  });
                  if (!verifyResponse.result || !verifyResponse.result.id) {
                    console.error(`Previous task verification failed: ${prevTask.title}`);
                    // Remove from updated tasks and retry
                    updatedTasks.pop();
                    const prevResult = results.pop();
                    errors.push({
                      task: prevResult.task,
                      dueDate: prevResult.dueDate,
                      success: false,
                      error: 'Verification failed after quota error'
                    });
                    i = prevTask.index; // Go back to retry previous task
                    taskUpdated = true; // Exit current task loop to retry previous
                    continue;
                  } else {
                    console.log(`Previous task verified successfully: ${prevTask.title}`);
                  }
                } catch (verifyError) {
                  console.error(`Error verifying previous task:`, verifyError);
                }
              }
              
              // Wait with increased delay before retrying current task
              await new Promise(resolve => setTimeout(resolve, baseDelay + variableDelay));
              // Loop will retry current task
              
            } else {
              // Not a quota error, don't retry
              console.error(`Failed to update task: ${task.title}`, error);
              errors.push({
                task: task,
                dueDate: dueDate,
                success: false,
                error: error.message || 'Unknown error'
              });
              taskUpdated = true; // Mark as "done" to move to next task
            }
          }
        }
      }

      // Show completion status
      const successCount = results.length;
      const errorCount = errors.length;
      
      if (errorCount === 0) {
        setDueDateAssignmentStatus(`✅ Successfully assigned due dates to ${successCount} tasks!`);
      } else {
        setDueDateAssignmentStatus(`⚠️ Completed with ${successCount} successes and ${errorCount} errors. Check console for details.`);
        
        // Log detailed error information
        if (errors.length > 0) {
          console.error('Due date assignment errors:', errors);
        }
      }

      // Refresh the task list to show updated due dates
      setTimeout(() => {
        loadDueDateTasks(selectedDueDateTaskList);
        setDueDateAssignmentStatus('');
      }, 3000);

    } catch (error) {
      console.error('Error during due date assignment:', error);
      setDueDateAssignmentStatus(`❌ Assignment failed: ${error.message}`);
      
      setTimeout(() => {
        setDueDateAssignmentStatus('');
      }, 5000);
    } finally {
      setIsAssigningDueDates(false);
      setDueDateAssignmentProgress({ current: 0, total: 0 });
    }
  };

  // Subtasks Management Functions
  const loadSubtasksTasks = async () => {
    if (!selectedSubtasksTaskList || !isSignedIn) return;

    setIsLoadingSubtasksTasks(true);
    try {
      const allTasks = [];
      let pageToken = null;
      
      do {
        const params = {
          tasklist: selectedSubtasksTaskList,
          maxResults: 100,
          showCompleted: true,
          showDeleted: false,
          showHidden: true
        };
        
        if (pageToken) {
          params.pageToken = pageToken;
        }
        
        const response = await window.gapi.client.tasks.tasks.list(params);
        const tasks = response.result.items || [];
        allTasks.push(...tasks);
        pageToken = response.result.nextPageToken;
        
        // Small delay to respect rate limits
        if (pageToken) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
      } while (pageToken);
      
      console.log('Loaded subtasks:', allTasks.length, 'tasks');
      setSubtasksTasks(allTasks);
      setSubtasksCurrentPage(1);
      
      // Force layout recalculation after tasks are loaded
      setTimeout(() => {
        const containers = document.querySelectorAll('.task-list-container');
        containers.forEach(container => {
          if (container) {
            container.style.display = 'none';
            container.offsetHeight; // Force reflow
            container.style.display = 'block';
          }
        });
      }, 50);
    } catch (error) {
      console.error('Error loading subtasks tasks:', error);
      alert('Error loading tasks. Please try again.');
    } finally {
      setIsLoadingSubtasksTasks(false);
    }
  };

  // Load tasks when task list changes
  useEffect(() => {
    if (selectedSubtasksTaskList) {
      loadSubtasksTasks();
    } else {
      setSubtasksTasks([]);
      setSubtasksSelectedTasks([]);
      setSubtasksParentTask(null);
      setSubtasksChildrenOrder([]);
    }
  }, [selectedSubtasksTaskList]);

  // Filter and sort subtasks tasks
  const filterAndSortSubtasksTasks = () => {
    let filtered = [...subtasksTasks];

    // Filter out completed tasks (we don't want to set relationships on completed tasks)
    filtered = filtered.filter(task => task.status !== 'completed');

    // Apply search filter
    if (subtasksSearchTerm.trim()) {
      const searchLower = subtasksCaseSensitive ? subtasksSearchTerm : subtasksSearchTerm.toLowerCase();
      filtered = filtered.filter(task => {
        const taskTitle = subtasksCaseSensitive ? task.title : task.title.toLowerCase();
        return taskTitle.includes(searchLower);
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (subtasksSortBy) {
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'alphabetical-desc':
          return b.title.localeCompare(a.title);
        case 'creation':
          return parseInt(a.position) - parseInt(b.position);
        case 'creation-desc':
          return parseInt(b.position) - parseInt(a.position);
        case 'duedate':
          // Tasks without due dates go to the end
          if (!a.due && !b.due) return 0;
          if (!a.due) return 1;
          if (!b.due) return -1;
          return new Date(a.due) - new Date(b.due);
        case 'duedate-desc':
          // Tasks without due dates go to the end
          if (!a.due && !b.due) return 0;
          if (!a.due) return 1;
          if (!b.due) return -1;
          return new Date(b.due) - new Date(a.due);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Pagination for subtasks
  const getSubtasksPageData = () => {
    const filtered = filterAndSortSubtasksTasks();
    const tasksPerPage = 50;
    const totalPages = Math.ceil(filtered.length / tasksPerPage);
    const startIndex = (subtasksCurrentPage - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    const currentTasks = filtered.slice(startIndex, endIndex);

    console.log('Page data:', {
      totalTasks: filtered.length,
      currentTasks: currentTasks.length,
      currentTaskTitles: currentTasks.map(t => t.title)
    });

    return {
      tasks: currentTasks,
      totalTasks: filtered.length,
      totalPages,
      currentPage: subtasksCurrentPage,
      tasksPerPage
    };
  };

  // Toggle task selection for subtasks
  const toggleSubtaskSelection = (task) => {
    if (subtasksParentTask && task.id === subtasksParentTask.id) {
      return; // Can't select parent as child
    }
    
    setSubtasksSelectedTasks(prev => {
      const isSelected = prev.some(t => t.id === task.id);
      if (isSelected) {
        return prev.filter(t => t.id !== task.id);
      } else {
        return [...prev, task];
      }
    });
  };

  // Set parent task
  const setParentTask = (task) => {
    try {
      console.log('Setting parent task:', task);
      setSubtasksParentTask(task);
      // Remove parent from selected tasks
      setSubtasksSelectedTasks(prev => prev.filter(t => t.id !== task.id));
      console.log('Parent task set successfully');
    } catch (error) {
      console.error('Error setting parent task:', error);
      alert('Error setting parent task: ' + error.message);
    }
  };

  // Select all tasks except parent
  const selectAllExceptParent = () => {
    const pageData = getSubtasksPageData();
    const availableTasks = pageData.tasks.filter(task => 
      !subtasksParentTask || task.id !== subtasksParentTask.id
    );
    setSubtasksSelectedTasks(availableTasks);
  };

  // Clear all selected subtasks
  const clearAllSubtasks = () => {
    setSubtasksSelectedTasks([]);
  };

  // Check if user is authenticated and connected
  const checkConnection = async () => {
    try {
      if (!isSignedIn) {
        throw new Error('Not signed in to Google');
      }
      
      if (!window.gapi || !window.gapi.client) {
        throw new Error('Google API client not initialized');
      }

      // Test connection with a simple API call using gapi.client
      const response = await window.gapi.client.tasks.tasklists.list({
        maxResults: 1
      });

      if (!response || !response.result) {
        throw new Error('API connection failed');
      }

      return true;
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  };

  // Update task parent relationship
  const updateTaskParent = async (taskId, taskListId, parentId, previousId = null) => {
    try {
      // Use gapi.client.tasks.tasks.move to set parent-child relationship
      const moveParams = {
        tasklist: taskListId,
        task: taskId,
        parent: parentId
      };

      if (previousId) {
        moveParams.previous = previousId;
      }

      const response = await window.gapi.client.tasks.tasks.move(moveParams);

      if (!response || !response.result) {
        throw new Error('Failed to update task parent');
      }

      return response.result;
    } catch (error) {
      console.error('Error updating task parent:', error);
      throw error;
    }
  };

  // Unset a task's parent-child relationship
  const unsetTaskRelationship = async (task) => {
    if (!task.parent) return;

    setIsSettingRelationships(true);
    setRelationshipStatus('Removing parent-child relationship...');
    setRelationshipProgress({ current: 0, total: 1 });

    try {
      // Remove the parent relationship by moving the task to root level (no parent)
      // We use tasks.move without specifying a parent parameter
      const moveParams = {
        tasklist: selectedSubtasksTaskList,
        task: task.id
        // Not specifying 'parent' parameter moves it to root level
      };

      const response = await window.gapi.client.tasks.tasks.move(moveParams);
      
      if (!response || !response.result) {
        throw new Error('Failed to remove parent relationship');
      }
      
      setRelationshipStatus('✓ Relationship removed successfully');
      setRelationshipProgress({ current: 1, total: 1 });
      
      // Refresh the task list to show updated relationships
      setTimeout(() => {
        loadSubtasksTasks();
        setIsSettingRelationships(false);
        setRelationshipStatus('');
      }, 1000);

    } catch (error) {
      console.error('Error unsetting relationship:', error);
      setIsSettingRelationships(false);
      setRelationshipStatus('❌ Error removing relationship');
      alert('Error removing relationship: ' + (error.message || 'Please try again.'));
      setTimeout(() => setRelationshipStatus(''), 3000);
    }
  };

  // Set parent-child relationships
  const setSubtasksRelationships = async () => {
    if (!subtasksParentTask || subtasksSelectedTasks.length === 0) {
      alert('Please select a parent task and at least one child task.');
      return;
    }

    // Check connection first
    setRelationshipStatus('Checking connection...');
    const isConnected = await checkConnection();
    if (!isConnected) {
      setRelationshipStatus('❌ Connection failed. Please check your internet connection and sign in again.');
      setTimeout(() => setRelationshipStatus(''), 5000);
      return;
    }

    setIsSettingRelationships(true);
    setRelationshipProgress({ current: 0, total: subtasksSelectedTasks.length });
    setRelationshipStatus('Setting up parent-child relationships...');

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    try {
      for (let i = 0; i < subtasksSelectedTasks.length; i++) {
        const childTask = subtasksSelectedTasks[i];
        const previousTask = i > 0 ? subtasksSelectedTasks[i - 1] : null;
        
        setRelationshipProgress({ current: i + 1, total: subtasksSelectedTasks.length });
        setRelationshipStatus(`Setting relationship ${i + 1} of ${subtasksSelectedTasks.length}: ${childTask.title}`);

        try {
          await updateTaskParent(
            childTask.id,
            selectedSubtasksTaskList,
            subtasksParentTask.id,
            previousTask?.id
          );
          successCount++;
          
          // Rate limiting delay
          if (i < subtasksSelectedTasks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        } catch (error) {
          errorCount++;
          errors.push(`${childTask.title}: ${error.message}`);
          console.error(`Error setting relationship for ${childTask.title}:`, error);
          
          // If we get authentication errors, stop processing
          if (error.message.includes('401') || error.message.includes('authentication')) {
            setRelationshipStatus('❌ Authentication error. Please sign in again and try again.');
            break;
          }
        }
      }

      // Show completion status
      if (successCount > 0 && errorCount === 0) {
        setRelationshipStatus(`✅ Successfully set ${successCount} parent-child relationships!`);
      } else if (successCount > 0 && errorCount > 0) {
        setRelationshipStatus(`⚠️ Completed with ${successCount} successes and ${errorCount} errors`);
      } else {
        setRelationshipStatus(`❌ Failed to set relationships. Please check your connection and try again.`);
      }

      if (errors.length > 0) {
        console.error('Relationship assignment errors:', errors);
      }

      // Refresh the task list to show new hierarchy
      if (successCount > 0) {
        setTimeout(() => {
          loadSubtasksTasks();
          // Clear selections
          setSubtasksParentTask(null);
          setSubtasksSelectedTasks([]);
        }, 2000);
      }

    } catch (error) {
      console.error('Error in bulk relationship assignment:', error);
      setRelationshipStatus(`❌ Error: ${error.message}`);
    } finally {
      setTimeout(() => {
        setIsSettingRelationships(false);
        setRelationshipProgress({ current: 0, total: 0 });
        setRelationshipStatus('');
      }, 5000);
    }
  };

  // Bulk Move Functions
  const loadBulkMoveTasks = async () => {
    if (!bulkMoveSourceList || !isSignedIn) return;

    setIsLoadingBulkMoveTasks(true);
    setBulkMoveTasks([]);
    setBulkMoveSelectedTasks([]);

    try {
      let allTasks = [];
      let pageToken = null;

      do {
        const params = {
          tasklist: bulkMoveSourceList,
          maxResults: 100,
          showCompleted: true,
          showHidden: true
        };

        if (pageToken) {
          params.pageToken = pageToken;
        }

        const response = await window.gapi.client.tasks.tasks.list(params);
        
        if (response.result.items) {
          allTasks = allTasks.concat(response.result.items);
        }

        pageToken = response.result.nextPageToken;

        // Rate limiting
        if (pageToken) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } while (pageToken);

      console.log(`Loaded ${allTasks.length} tasks from source list`);
      setBulkMoveTasks(allTasks);
      setBulkMoveCurrentPage(1);

    } catch (error) {
      console.error('Error loading bulk move tasks:', error);
      alert('Error loading tasks. Please try again.');
    } finally {
      setIsLoadingBulkMoveTasks(false);
    }
  };

  useEffect(() => {
    if (bulkMoveSourceList) {
      loadBulkMoveTasks();
    } else {
      setBulkMoveTasks([]);
      setBulkMoveSelectedTasks([]);
    }
  }, [bulkMoveSourceList]);

  // Helper function to parse duration from notes
  const parseDurationFromNotes = (notes) => {
    if (!notes) return null;
    
    const noteText = notes.trim();
    
    // Only match duration patterns at the START of the notes (first 50 characters)
    // This prevents matching URL parameters like "t=8s" or time references in the middle of text
    const startOfNotes = noteText.substring(0, 50).toLowerCase();
    
    // Match patterns like: 5s, 30 seconds, 5min, 10 minutes, 2h, 1 hour, 30m, 3 hours, 1d, 2 days, etc.
    // Using ^ to anchor at start, allowing optional whitespace
    const patterns = [
      /^(\d+\.?\d*)\s*s(?:ec(?:ond)?)?s?\s*[-\s]/i,  // seconds followed by dash or space
      /^(\d+\.?\d*)\s*min(?:ute)?s?\s*[-\s]/i,
      /^(\d+\.?\d*)\s*m\s*[-\s]/i,  // m followed by dash or space (not 'month')
      /^(\d+\.?\d*)\s*h(?:our)?s?\s*[-\s]/i,
      /^(\d+\.?\d*)\s*d(?:ay)?s?\s*[-\s]/i,
      /^(\d+\.?\d*)\s*w(?:eek)?s?\s*[-\s]/i,
      /^(\d+\.?\d*)\s*mo(?:nth)?s?\s*[-\s]/i
    ];
    
    const unitMultipliers = {
      's': 1,        // seconds
      'sec': 1,
      'second': 1,
      'm': 60,       // minutes to seconds
      'min': 60,
      'minute': 60,
      'h': 3600,     // hours to seconds
      'hour': 3600,
      'd': 86400,    // days to seconds
      'day': 86400,
      'w': 604800,   // weeks to seconds
      'week': 604800,
      'mo': 2592000, // months (30 days) to seconds
      'month': 2592000
    };
    
    for (const pattern of patterns) {
      const match = startOfNotes.match(pattern);
      if (match) {
        const value = parseFloat(match[1]);
        let unit = match[0].replace(/[\d\s.\-]/g, '').toLowerCase();
        
        // Normalize unit
        if (unit.startsWith('sec') || unit === 's') unit = 's';
        else if (unit.startsWith('min')) unit = 'minute';
        else if (unit === 'm') unit = 'm';
        else if (unit.startsWith('h')) unit = 'hour';
        else if (unit.startsWith('d')) unit = 'day';
        else if (unit.startsWith('w')) unit = 'week';
        else if (unit.startsWith('mo')) unit = 'month';
        
        const multiplier = unitMultipliers[unit] || 1;
        return value * multiplier; // Return duration in seconds
      }
    }
    
    return null;
  };

  const filterAndSortBulkMoveTasks = () => {
    let filtered = [...bulkMoveTasks];

    // Filter out completed tasks
    filtered = filtered.filter(task => task.status !== 'completed');

    // Apply search filter
    if (bulkMoveSearchTerm.trim()) {
      const searchLower = bulkMoveCaseSensitive ? bulkMoveSearchTerm : bulkMoveSearchTerm.toLowerCase();
      filtered = filtered.filter(task => {
        const fieldToSearch = bulkMoveSortField === 'notes' ? (task.notes || '') : task.title;
        const taskField = bulkMoveCaseSensitive ? fieldToSearch : fieldToSearch.toLowerCase();
        return taskField.includes(searchLower);
      });
    }

    // Apply duplicate filter
    if (bulkMoveShowDuplicates) {
      const fieldToCheck = bulkMoveSortField; // 'title' or 'notes'
      const valueCounts = new Map();
      
      // Count occurrences of each value
      filtered.forEach(task => {
        const value = fieldToCheck === 'notes' ? (task.notes || '') : task.title;
        const normalizedValue = bulkMoveCaseSensitive ? value : value.toLowerCase();
        valueCounts.set(normalizedValue, (valueCounts.get(normalizedValue) || 0) + 1);
      });
      
      // Filter to show only tasks with duplicate values
      filtered = filtered.filter(task => {
        const value = fieldToCheck === 'notes' ? (task.notes || '') : task.title;
        const normalizedValue = bulkMoveCaseSensitive ? value : value.toLowerCase();
        return valueCounts.get(normalizedValue) > 1;
      });
    }

    // Apply duration filter
    if (bulkMoveDurationFilter.enabled) {
      const unitMultipliers = {
        'seconds': 1,
        'minutes': 60,
        'hours': 3600,
        'days': 86400
      };
      
      if (bulkMoveDurationFilter.mode === 'range' && bulkMoveDurationFilter.valueMin && bulkMoveDurationFilter.valueMax) {
        const filterMinSeconds = parseFloat(bulkMoveDurationFilter.valueMin) * (unitMultipliers[bulkMoveDurationFilter.unit] || 1);
        const filterMaxSeconds = parseFloat(bulkMoveDurationFilter.valueMax) * (unitMultipliers[bulkMoveDurationFilter.unit] || 1);
        
        filtered = filtered.filter(task => {
          const taskDurationSeconds = parseDurationFromNotes(task.notes);
          
          if (taskDurationSeconds === null) {
            return false; // Exclude tasks without duration in notes
          }
          
          return taskDurationSeconds >= filterMinSeconds && taskDurationSeconds <= filterMaxSeconds;
        });
      } else if (bulkMoveDurationFilter.mode === 'single' && bulkMoveDurationFilter.value) {
        const filterValue = parseFloat(bulkMoveDurationFilter.value);
        const filterSeconds = filterValue * (unitMultipliers[bulkMoveDurationFilter.unit] || 1);
        
        filtered = filtered.filter(task => {
          const taskDurationSeconds = parseDurationFromNotes(task.notes);
          
          if (taskDurationSeconds === null) {
            return false; // Exclude tasks without duration in notes
          }
          
          switch (bulkMoveDurationFilter.operator) {
            case 'less':
              return taskDurationSeconds < filterSeconds;
            case 'greater':
              return taskDurationSeconds > filterSeconds;
            case 'equal':
              return Math.abs(taskDurationSeconds - filterSeconds) < 0.01;
            default:
              return true;
          }
        });
      }
    }

    // Filter out recurring tasks if option is enabled
    if (bulkMoveOmitRecurring) {
      filtered = filtered.filter(task => !task.recurrence);
    }

    // Apply hierarchy filter
    filtered = filtered.filter(task => {
      const isParent = task.hasChildren || false;
      const isChild = task.parent ? true : false;
      const isStandalone = !isParent && !isChild;
      
      if (isStandalone && !bulkMoveHierarchyFilter.standalone) return false;
      if (isParent && !bulkMoveHierarchyFilter.parent) return false;
      if (isChild && !bulkMoveHierarchyFilter.child) return false;
      
      return true;
    });

    // Apply date filter
    if (bulkMoveDateFilter.enabled) {
      filtered = filtered.filter(task => {
        if (!task.due) return false; // Exclude tasks without due date
        
        const taskDate = new Date(task.due);
        taskDate.setHours(0, 0, 0, 0); // Normalize to start of day
        const taskTime = taskDate.getTime();
        
        switch (bulkMoveDateFilter.mode) {
          case 'exact':
            if (!bulkMoveDateFilter.date) return true;
            const filterDate = new Date(bulkMoveDateFilter.date);
            filterDate.setHours(0, 0, 0, 0);
            return taskTime === filterDate.getTime();
            
          case 'before':
            if (!bulkMoveDateFilter.date) return true;
            const beforeDate = new Date(bulkMoveDateFilter.date);
            beforeDate.setHours(0, 0, 0, 0);
            return taskTime <= beforeDate.getTime();
            
          case 'after':
            if (!bulkMoveDateFilter.date) return true;
            const afterDate = new Date(bulkMoveDateFilter.date);
            afterDate.setHours(0, 0, 0, 0);
            return taskTime >= afterDate.getTime();
            
          case 'range':
            if (!bulkMoveDateFilter.dateStart || !bulkMoveDateFilter.dateEnd) return true;
            const startDate = new Date(bulkMoveDateFilter.dateStart);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(bulkMoveDateFilter.dateEnd);
            endDate.setHours(0, 0, 0, 0);
            return taskTime >= startDate.getTime() && taskTime <= endDate.getTime();
            
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (bulkMoveSortBy) {
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'alphabetical-desc':
          return b.title.localeCompare(a.title);
        case 'creation':
          return parseInt(a.position) - parseInt(b.position);
        case 'creation-desc':
          return parseInt(b.position) - parseInt(a.position);
        case 'duedate':
          // Tasks without due dates go to the end
          if (!a.due && !b.due) return 0;
          if (!a.due) return 1;
          if (!b.due) return -1;
          return new Date(a.due) - new Date(b.due);
        case 'duedate-desc':
          // Tasks without due dates go to the end
          if (!a.due && !b.due) return 0;
          if (!a.due) return 1;
          if (!b.due) return -1;
          return new Date(b.due) - new Date(a.due);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getBulkMovePageData = () => {
    const filtered = filterAndSortBulkMoveTasks();
    const tasksPerPage = 20;
    const totalPages = Math.ceil(filtered.length / tasksPerPage);
    const startIndex = (bulkMoveCurrentPage - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    const currentTasks = filtered.slice(startIndex, endIndex);

    return {
      tasks: currentTasks,
      totalTasks: filtered.length,
      totalPages,
      currentPage: bulkMoveCurrentPage
    };
  };

  const toggleBulkMoveTaskSelection = (task) => {
    setBulkMoveSelectedTasks(prev => {
      const isSelected = prev.some(t => t.id === task.id);
      if (isSelected) {
        return prev.filter(t => t.id !== task.id);
      } else {
        return [...prev, task];
      }
    });
  };

  const selectAllBulkMoveTasks = () => {
    const pageData = getBulkMovePageData();
    setBulkMoveSelectedTasks(pageData.tasks);
  };

  const clearAllBulkMoveTasks = () => {
    setBulkMoveSelectedTasks([]);
  };

  const selectAllFilteredBulkMoveTasks = () => {
    const filtered = filterAndSortBulkMoveTasks();
    setBulkMoveSelectedTasks(filtered);
  };

  const applyBulkMovePreset = (presetNumber) => {
    setBulkMoveActivePreset(`preset${presetNumber}`);
    
    // Placeholder for preset logic - will be customized later
    switch (presetNumber) {
      case 1:
        // Preset 1 logic (to be defined)
        setBulkMoveSearchTerm('');
        break;
      case 2:
        // Preset 2 logic (to be defined)
        setBulkMoveSearchTerm('');
        break;
      case 3:
        // Preset 3 logic (to be defined)
        setBulkMoveSearchTerm('');
        break;
      case 4:
        // Preset 4 logic (to be defined)
        setBulkMoveSearchTerm('');
        break;
      case 5:
        // Preset 5 logic (to be defined)
        setBulkMoveSearchTerm('');
        break;
      default:
        break;
    }
  };

  const moveBulkTasks = async () => {
    // Validation is now handled by button disabled state
    // No popups needed
    
    setIsMovingTasks(true);
    setMoveProgress({ current: 0, total: bulkMoveSelectedTasks.length });
    setMoveStatus('Starting task move...');

    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    const baseDelay = 200; // Base delay in ms (constant)
    let variableDelay = 100; // Variable delay in ms (min 100ms)
    const minVariableDelay = 100;
    const movedTasks = []; // Track moved task IDs for verification

    try {
      for (let i = 0; i < bulkMoveSelectedTasks.length; i++) {
        const task = bulkMoveSelectedTasks[i];
        let taskMoved = false;
        
        while (!taskMoved) {
          try {
            const totalDelay = baseDelay + variableDelay;
            setMoveProgress({ current: i + 1, total: bulkMoveSelectedTasks.length });
            setMoveStatus(`Moving task ${i + 1} of ${bulkMoveSelectedTasks.length}: ${task.title}\n(delay: ${totalDelay}ms = ${baseDelay}+${variableDelay})`);

            // Move task using the Google Tasks API
            const response = await window.gapi.client.tasks.tasks.move({
              tasklist: bulkMoveSourceList,
              task: task.id,
              destinationTasklist: bulkMoveDestinationList
            });

            // Verify the move was successful
            if (response && response.result) {
              movedTasks.push({ id: task.id, title: task.title, index: i });
              successCount++;
              taskMoved = true;
              console.log(`Successfully moved: ${task.title}`);
              
              // On success: reduce variable delay by 10ms (linear decrease, min 100ms)
              variableDelay = Math.max(variableDelay - 10, minVariableDelay);
            } else {
              throw new Error('Move operation did not return expected result');
            }

            // Rate limiting delay
            if (i < bulkMoveSelectedTasks.length - 1) {
              await new Promise(resolve => setTimeout(resolve, baseDelay + variableDelay));
            }
          } catch (error) {
            // Check if it's a 403 quota exceeded error
            if (error.status === 403 || error.code === 403 || 
                (error.result && error.result.code === 403) ||
                (error.message && (error.message.toLowerCase().includes('quota') || error.message.toLowerCase().includes('rate limit')))) {
              // Double the variable delay
              variableDelay = variableDelay * 2;
              console.warn(`403 quota exceeded. Doubling variable delay to ${variableDelay}ms (total: ${baseDelay + variableDelay}ms)`);
              
              // Verify previous task if it exists
              if (movedTasks.length > 0) {
                const prevTask = movedTasks[movedTasks.length - 1];
                console.log(`Verifying previous task: ${prevTask.title}`);
                try {
                  const verifyResponse = await window.gapi.client.tasks.tasks.get({
                    tasklist: bulkMoveDestinationList,
                    task: prevTask.id
                  });
                  if (!verifyResponse.result || !verifyResponse.result.id) {
                    console.error(`Previous task verification failed: ${prevTask.title}`);
                    // Remove from moved tasks and retry
                    movedTasks.pop();
                    successCount--;
                    i = prevTask.index; // Go back to retry previous task
                    taskMoved = true; // Exit current task loop to retry previous
                    continue;
                  } else {
                    console.log(`Previous task verified successfully: ${prevTask.title}`);
                  }
                } catch (verifyError) {
                  console.error(`Error verifying previous task:`, verifyError);
                }
              }
              
              // Wait with increased delay before retrying current task
              await new Promise(resolve => setTimeout(resolve, baseDelay + variableDelay));
              // Loop will retry current task
              
            } else {
              // Not a quota error, don't retry
              errorCount++;
              errors.push(`${task.title}: ${error.message}`);
              console.error(`Error moving ${task.title}:`, error);
              taskMoved = true; // Mark as "done" to move to next task
            }
          }
        }
      }

      // Show completion status
      if (successCount > 0 && errorCount === 0) {
        setMoveStatus(`✅ Successfully moved ${successCount} task(s)!`);
      } else if (successCount > 0 && errorCount > 0) {
        setMoveStatus(`⚠️ Moved ${successCount} task(s) with ${errorCount} error(s)`);
      } else {
        setMoveStatus(`❌ Failed to move tasks. Please try again.`);
      }

      if (errors.length > 0) {
        console.error('Move errors:', errors);
      }

      // Refresh the source task list
      if (successCount > 0) {
        setTimeout(() => {
          loadBulkMoveTasks();
          setBulkMoveSelectedTasks([]);
        }, 2000);
      }

    } catch (error) {
      console.error('Error in bulk move operation:', error);
      setMoveStatus(`❌ Error: ${error.message}`);
    } finally {
      setTimeout(() => {
        setIsMovingTasks(false);
        setMoveProgress({ current: 0, total: 0 });
        setMoveStatus('');
      }, 5000);
    }
  };

  // YouTube Playlist to Task Functions
  const extractPlaylistId = (url) => {
    const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const fetchPlaylistVideos = async (playlistId) => {
    let allVideos = [];
    let pageToken = null;

    try {
      do {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&pageToken=${pageToken || ''}&key=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`YouTube API error: ${response.status}`);
        }

        const data = await response.json();
        
        // Filter out private/deleted videos
        const validVideos = (data.items || []).filter(item => {
          return item.snippet && 
                 item.snippet.resourceId && 
                 item.snippet.resourceId.videoId &&
                 item.snippet.title !== 'Private video' &&
                 item.snippet.title !== 'Deleted video';
        });

        allVideos = allVideos.concat(validVideos);
        pageToken = data.nextPageToken;

        // Rate limiting between page requests
        if (pageToken) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } while (pageToken);

      return allVideos;
    } catch (error) {
      console.error('Error fetching playlist videos:', error);
      throw error;
    }
  };

  const processYoutubePlaylist = async () => {
    if (!youtubeTaskList || !youtubePlaylistUrl) {
      return;
    }

    const playlistId = extractPlaylistId(youtubePlaylistUrl);
    if (!playlistId) {
      setPlaylistStatus('❌ Invalid playlist URL');
      setTimeout(() => setPlaylistStatus(''), 3000);
      return;
    }

    setIsProcessingPlaylist(true);
    setPlaylistProgress({ current: 0, total: 0 });
    setPlaylistStatus('Fetching playlist videos...');

    try {
      // Fetch all videos from playlist
      const videos = await fetchPlaylistVideos(playlistId);
      
      if (videos.length === 0) {
        setPlaylistStatus('❌ No valid videos found in playlist');
        setTimeout(() => {
          setIsProcessingPlaylist(false);
          setPlaylistStatus('');
        }, 3000);
        return;
      }

      setPlaylistProgress({ current: 0, total: videos.length });
      setPlaylistStatus(`Creating tasks for ${videos.length} videos...`);

      let successCount = 0;
      let failureCount = 0;

      // Process videos serially
      for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        const videoId = video.snippet.resourceId.videoId;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        setPlaylistProgress({ current: i + 1, total: videos.length });
        setPlaylistStatus(`Creating task ${i + 1} of ${videos.length}: ${video.snippet.title}`);

        try {
          // Create task with video URL as title, empty notes
          await window.gapi.client.tasks.tasks.insert({
            tasklist: youtubeTaskList,
            resource: {
              title: videoUrl,
              notes: ''
            }
          });

          successCount++;
          console.log(`Created task for video: ${video.snippet.title}`);

          // Rate limiting between task creation
          if (i < videos.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 400));
          }
        } catch (error) {
          console.error(`Failed to create task for video: ${video.snippet.title}`, error);
          failureCount++;
        }
      }

      // Show completion status
      if (failureCount === 0) {
        setPlaylistStatus(`✅ Successfully created ${successCount} tasks!`);
      } else {
        setPlaylistStatus(`⚠️ Created ${successCount} tasks, ${failureCount} failed`);
      }

      // Clear the playlist URL input
      setYoutubePlaylistUrl('');

    } catch (error) {
      console.error('Error processing playlist:', error);
      setPlaylistStatus(`❌ Error: ${error.message}`);
    } finally {
      setTimeout(() => {
        setIsProcessingPlaylist(false);
        setPlaylistProgress({ current: 0, total: 0 });
        setPlaylistStatus('');
      }, 5000);
    }
  };

  // Complete Tasks Functions
  const loadCompleteTasks = async () => {
    if (!completeTasksList || !isSignedIn) return;

    setIsLoadingCompleteTasks(true);
    setCompleteTasks([]);
    setCompleteSelectedTasks([]);

    try {
      let allTasks = [];
      let pageToken = null;

      do {
        const params = {
          tasklist: completeTasksList,
          maxResults: 100,
          showCompleted: true,
          showHidden: true
        };

        if (pageToken) {
          params.pageToken = pageToken;
        }

        const response = await window.gapi.client.tasks.tasks.list(params);
        
        if (response.result.items) {
          allTasks = allTasks.concat(response.result.items);
        }

        pageToken = response.result.nextPageToken;

        // Rate limiting
        if (pageToken) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } while (pageToken);

      console.log(`Loaded ${allTasks.length} tasks from list`);
      setCompleteTasks(allTasks);
      setCompleteCurrentPage(1);

    } catch (error) {
      console.error('Error loading complete tasks:', error);
      alert('Error loading tasks. Please try again.');
    } finally {
      setIsLoadingCompleteTasks(false);
    }
  };

  useEffect(() => {
    if (completeTasksList) {
      loadCompleteTasks();
    }
  }, [completeTasksList]);

  const filterAndSortCompleteTasks = () => {
    let filtered = [...completeTasks];

    // Filter out completed tasks (we only want incomplete tasks)
    filtered = filtered.filter(task => task.status !== 'completed');

    // Apply search filter
    if (completeSearchTerm.trim()) {
      const searchLower = completeCaseSensitive ? completeSearchTerm : completeSearchTerm.toLowerCase();
      filtered = filtered.filter(task => {
        const fieldToSearch = completeSortField === 'notes' ? (task.notes || '') : task.title;
        const taskField = completeCaseSensitive ? fieldToSearch : fieldToSearch.toLowerCase();
        return taskField.includes(searchLower);
      });
    }

    // Apply duplicate filter
    if (completeShowDuplicates) {
      const fieldToCheck = completeSortField;
      const valueCounts = new Map();
      
      filtered.forEach(task => {
        const value = fieldToCheck === 'notes' ? (task.notes || '') : task.title;
        const normalizedValue = completeCaseSensitive ? value : value.toLowerCase();
        valueCounts.set(normalizedValue, (valueCounts.get(normalizedValue) || 0) + 1);
      });
      
      filtered = filtered.filter(task => {
        const value = fieldToCheck === 'notes' ? (task.notes || '') : task.title;
        const normalizedValue = completeCaseSensitive ? value : value.toLowerCase();
        return valueCounts.get(normalizedValue) > 1;
      });
    }

    // Apply duration filter
    if (completeDurationFilter.enabled) {
      const unitMultipliers = {
        'seconds': 1,
        'minutes': 60,
        'hours': 3600,
        'days': 86400
      };
      
      if (completeDurationFilter.mode === 'range' && completeDurationFilter.valueMin && completeDurationFilter.valueMax) {
        const filterMinSeconds = parseFloat(completeDurationFilter.valueMin) * (unitMultipliers[completeDurationFilter.unit] || 1);
        const filterMaxSeconds = parseFloat(completeDurationFilter.valueMax) * (unitMultipliers[completeDurationFilter.unit] || 1);
        
        filtered = filtered.filter(task => {
          const taskDurationSeconds = parseDurationFromNotes(task.notes);
          if (taskDurationSeconds === null) return false;
          return taskDurationSeconds >= filterMinSeconds && taskDurationSeconds <= filterMaxSeconds;
        });
      } else if (completeDurationFilter.mode === 'single' && completeDurationFilter.value) {
        const filterValue = parseFloat(completeDurationFilter.value);
        const filterSeconds = filterValue * (unitMultipliers[completeDurationFilter.unit] || 1);
        
        filtered = filtered.filter(task => {
          const taskDurationSeconds = parseDurationFromNotes(task.notes);
          if (taskDurationSeconds === null) return false;
          
          switch (completeDurationFilter.operator) {
            case 'less':
              return taskDurationSeconds < filterSeconds;
            case 'greater':
              return taskDurationSeconds > filterSeconds;
            case 'equal':
              return Math.abs(taskDurationSeconds - filterSeconds) < 0.01;
            default:
              return true;
          }
        });
      }
    }

    // Filter out recurring tasks if option is enabled
    if (completeOmitRecurring) {
      filtered = filtered.filter(task => !task.recurrence);
    }

    // Apply hierarchy filter
    filtered = filtered.filter(task => {
      const isParent = task.hasChildren || false;
      const isChild = task.parent ? true : false;
      const isStandalone = !isParent && !isChild;
      
      if (isStandalone && !completeHierarchyFilter.standalone) return false;
      if (isParent && !completeHierarchyFilter.parent) return false;
      if (isChild && !completeHierarchyFilter.child) return false;
      
      return true;
    });

    // Apply date filter
    if (completeDateFilter.enabled) {
      filtered = filtered.filter(task => {
        if (!task.due) return false;
        
        const taskDate = new Date(task.due);
        taskDate.setHours(0, 0, 0, 0);
        const taskTime = taskDate.getTime();
        
        switch (completeDateFilter.mode) {
          case 'exact':
            if (!completeDateFilter.date) return true;
            const filterDate = new Date(completeDateFilter.date);
            filterDate.setHours(0, 0, 0, 0);
            return taskTime === filterDate.getTime();
            
          case 'before':
            if (!completeDateFilter.date) return true;
            const beforeDate = new Date(completeDateFilter.date);
            beforeDate.setHours(0, 0, 0, 0);
            return taskTime <= beforeDate.getTime();
            
          case 'after':
            if (!completeDateFilter.date) return true;
            const afterDate = new Date(completeDateFilter.date);
            afterDate.setHours(0, 0, 0, 0);
            return taskTime >= afterDate.getTime();
            
          case 'range':
            if (!completeDateFilter.dateStart || !completeDateFilter.dateEnd) return true;
            const startDate = new Date(completeDateFilter.dateStart);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(completeDateFilter.dateEnd);
            endDate.setHours(0, 0, 0, 0);
            return taskTime >= startDate.getTime() && taskTime <= endDate.getTime();
            
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (completeSortBy) {
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'reverse-alphabetical':
          return b.title.localeCompare(a.title);
        case 'due-date-earliest':
          if (!a.due && !b.due) return 0;
          if (!a.due) return 1;
          if (!b.due) return -1;
          return new Date(a.due) - new Date(b.due);
        case 'due-date-latest':
          if (!a.due && !b.due) return 0;
          if (!a.due) return 1;
          if (!b.due) return -1;
          return new Date(b.due) - new Date(a.due);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getCompletePageData = () => {
    const filtered = filterAndSortCompleteTasks();
    const tasksPerPage = 20;
    const totalPages = Math.ceil(filtered.length / tasksPerPage);
    const startIndex = (completeCurrentPage - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    const paginatedTasks = filtered.slice(startIndex, endIndex);

    return {
      tasks: paginatedTasks,
      totalTasks: filtered.length,
      totalPages,
      currentPage: completeCurrentPage
    };
  };

  const markTasksComplete = async () => {
    if (completeSelectedTasks.length === 0) return;

    setIsCompletingTasks(true);
    setCompleteProgress({ current: 0, total: completeSelectedTasks.length });
    setCompleteStatus('Starting to mark tasks as complete...');

    let successCount = 0;
    let failureCount = 0;
    const baseDelay = 200; // Base delay in ms (constant)
    let variableDelay = 100; // Variable delay in ms (min 100ms)
    const minVariableDelay = 100;
    const completedTasks = []; // Track completed task IDs for verification

    try {
      // Process tasks serially
      for (let i = 0; i < completeSelectedTasks.length; i++) {
        const taskId = completeSelectedTasks[i];
        const task = completeTasks.find(t => t.id === taskId);
        let taskCompleted = false;

        while (!taskCompleted) {
          try {
            const totalDelay = baseDelay + variableDelay;
            setCompleteProgress({ current: i + 1, total: completeSelectedTasks.length });
            setCompleteStatus(`Completing task ${i + 1} of ${completeSelectedTasks.length}: ${task?.title || taskId}\n(delay: ${totalDelay}ms = ${baseDelay}+${variableDelay})`);

            // Mark task as complete
            const updateResponse = await window.gapi.client.tasks.tasks.patch({
              tasklist: completeTasksList,
              task: taskId,
              resource: {
                status: 'completed'
              }
            });

            // Verify the task was marked as complete
            if (updateResponse.result.status === 'completed') {
              completedTasks.push({ id: taskId, title: task?.title || taskId, index: i });
              successCount++;
              taskCompleted = true;
              console.log(`Task ${taskId} marked as complete`);
              
              // On success: reduce variable delay by 10ms (linear decrease, min 100ms)
              variableDelay = Math.max(variableDelay - 10, minVariableDelay);
            } else {
              throw new Error('Task update did not verify');
            }

            // Rate limiting
            if (i < completeSelectedTasks.length - 1) {
              await new Promise(resolve => setTimeout(resolve, baseDelay + variableDelay));
            }

          } catch (error) {
            // Check if it's a 403 quota exceeded error
            if (error.status === 403 || error.code === 403 || 
                (error.result && error.result.code === 403) ||
                (error.message && (error.message.toLowerCase().includes('quota') || error.message.toLowerCase().includes('rate limit')))) {
              // Double the variable delay
              variableDelay = variableDelay * 2;
              console.warn(`403 quota exceeded. Doubling variable delay to ${variableDelay}ms (total: ${baseDelay + variableDelay}ms)`);
              
              // Verify previous task if it exists
              if (completedTasks.length > 0) {
                const prevTask = completedTasks[completedTasks.length - 1];
                console.log(`Verifying previous task: ${prevTask.title}`);
                try {
                  const verifyResponse = await window.gapi.client.tasks.tasks.get({
                    tasklist: completeTasksList,
                    task: prevTask.id
                  });
                  if (!verifyResponse.result || verifyResponse.result.status !== 'completed') {
                    console.error(`Previous task verification failed: ${prevTask.title}`);
                    // Remove from completed tasks and retry
                    completedTasks.pop();
                    successCount--;
                    i = prevTask.index; // Go back to retry previous task
                    taskCompleted = true; // Exit current task loop to retry previous
                    continue;
                  } else {
                    console.log(`Previous task verified successfully: ${prevTask.title}`);
                  }
                } catch (verifyError) {
                  console.error(`Error verifying previous task:`, verifyError);
                }
              }
              
              // Wait with increased delay before retrying current task
              await new Promise(resolve => setTimeout(resolve, baseDelay + variableDelay));
              // Loop will retry current task
              
            } else {
              // Not a quota error, don't retry
              console.error(`Error completing task ${taskId}:`, error);
              failureCount++;
              taskCompleted = true; // Mark as "done" to move to next task
            }
          }
        }
      }

      // Show final status
      if (failureCount === 0) {
        setCompleteStatus(`✅ Successfully marked ${successCount} tasks as complete!`);
      } else {
        setCompleteStatus(`⚠️ Marked ${successCount} tasks as complete, ${failureCount} failed`);
      }

      // Reload tasks to reflect changes
      await loadCompleteTasks();

    } catch (error) {
      console.error('Error in markTasksComplete:', error);
      setCompleteStatus(`❌ Error: ${error.message}`);
    } finally {
      setTimeout(() => {
        setIsCompletingTasks(false);
        setCompleteProgress({ current: 0, total: 0 });
        setCompleteStatus('');
        setCompleteSelectedTasks([]);
      }, 5000);
    }
  };

  const insertSingleTask = async (taskTitle, taskListId) => {
    try {
      console.log(`Inserting task: "${taskTitle}" into list: ${taskListId}`);
      
      const response = await window.gapi.client.tasks.tasks.insert({
        tasklist: taskListId,
        resource: {
          title: taskTitle.trim()
        }
      });
      
      // Check if response is valid
      if (!response || !response.result) {
        throw new Error('Invalid response from API');
      }
      
      console.log('Task inserted successfully:', response.result);
      
      // Verify the task was created by checking its title and ID
      const insertedTask = response.result;
      if (!insertedTask.id) {
        throw new Error('Task was not assigned an ID');
      }
      if (insertedTask.title !== taskTitle.trim()) {
        throw new Error(`Task title mismatch. Expected: "${taskTitle.trim()}", Got: "${insertedTask.title}"`);
      }
      
      return insertedTask;
    } catch (error) {
      // Check if it's a 403 rate limit error
      if (error.status === 403 || error.code === 403) {
        console.error('Rate limit exceeded (403). Consider increasing delay between requests.');
        throw new Error('Rate limit exceeded. Please wait and try again.');
      }
      
      // Log detailed error information
      console.error('Error inserting task:', {
        message: error.message,
        status: error.status,
        code: error.code,
        details: error.result || error
      });
      throw error;
    }
  };

  const handleBulkInsert = async () => {
    if (!selectedTaskList) {
      alert('Please select a task list first.');
      return;
    }

    const taskLines = bulkTasksText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (taskLines.length === 0) {
      alert('Please enter at least one task.');
      return;
    }

    setIsInserting(true);
    setInsertProgress({ current: 0, total: taskLines.length });
    setInsertStatus('Starting bulk insert...');

    let successCount = 0;
    let failureCount = 0;
    const failures = [];
    const baseDelay = 200; // Base delay in ms (constant)
    let variableDelay = 100; // Variable delay in ms (min 100ms)
    const minVariableDelay = 100;
    const insertedTasks = []; // Track inserted task IDs for verification

    try {
      for (let i = 0; i < taskLines.length; i++) {
        const taskTitle = taskLines[i];
        let taskInserted = false;
        
        while (!taskInserted) {
          try {
            const totalDelay = baseDelay + variableDelay;
            setInsertStatus(`Inserting task ${i + 1} of ${taskLines.length}: "${taskTitle}"\n(delay: ${totalDelay}ms = ${baseDelay}+${variableDelay})`);
            setInsertProgress({ current: i, total: taskLines.length });
            
            const insertedTask = await insertSingleTask(taskTitle, selectedTaskList);
            insertedTasks.push({ id: insertedTask.id, title: taskTitle, index: i });
            successCount++;
            taskInserted = true;
            
            // On success: reduce variable delay by 10ms (linear decrease, min 100ms)
            variableDelay = Math.max(variableDelay - 10, minVariableDelay);
            
            // Rate limiting: wait between requests
            if (i < taskLines.length - 1) {
              await new Promise(resolve => setTimeout(resolve, baseDelay + variableDelay));
            }
            
          } catch (error) {
            // Check if it's a 403 quota exceeded error
            if (error.status === 403 || error.code === 403 || 
                (error.result && error.result.code === 403) ||
                (error.message && (error.message.toLowerCase().includes('quota') || error.message.toLowerCase().includes('rate limit')))) {
              // Double the variable delay
              variableDelay = variableDelay * 2;
              console.warn(`403 quota exceeded. Doubling variable delay to ${variableDelay}ms (total: ${baseDelay + variableDelay}ms)`);
              
              // Verify previous task if it exists
              if (insertedTasks.length > 0) {
                const prevTask = insertedTasks[insertedTasks.length - 1];
                console.log(`Verifying previous task: ${prevTask.title}`);
                try {
                  const verifyResponse = await window.gapi.client.tasks.tasks.get({
                    tasklist: selectedTaskList,
                    task: prevTask.id
                  });
                  if (!verifyResponse.result || !verifyResponse.result.id) {
                    console.error(`Previous task verification failed: ${prevTask.title}`);
                    // Remove from inserted tasks and retry
                    insertedTasks.pop();
                    successCount--;
                    i = prevTask.index; // Go back to retry previous task
                    taskInserted = true; // Exit current task loop to retry previous
                    continue;
                  } else {
                    console.log(`Previous task verified successfully: ${prevTask.title}`);
                  }
                } catch (verifyError) {
                  console.error(`Error verifying previous task:`, verifyError);
                }
              }
              
              // Wait with increased delay before retrying current task
              await new Promise(resolve => setTimeout(resolve, baseDelay + variableDelay));
              // Loop will retry current task
              
            } else {
              // Not a quota error, don't retry
              console.error(`Failed to insert task "${taskTitle}":`, error);
              failureCount++;
              failures.push({ task: taskTitle, error: error.message });
              taskInserted = true; // Mark as "done" to move to next task
            }
          }
        }
      }
      
      setInsertProgress({ current: taskLines.length, total: taskLines.length });
      
      let statusMessage = `Bulk insert completed! ${successCount} tasks inserted successfully.`;
      if (failureCount > 0) {
        statusMessage += ` ${failureCount} tasks failed.`;
        console.log('Failed tasks:', failures);
      }
      
      setInsertStatus(statusMessage);
      
      // Clear the text area if all tasks were successful
      if (failureCount === 0) {
        setBulkTasksText('');
      }
      
    } catch (error) {
      console.error('Bulk insert error:', error);
      setInsertStatus('Bulk insert failed: ' + error.message);
    } finally {
      setIsInserting(false);
    }
  };

  // Validation for bulk notes
  const validateNotesInput = () => {
    const errors = [];
    
    const taskNames = taskNamesText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    const notes = notesText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Check if there are more notes than tasks
    if (notes.length > taskNames.length) {
      errors.push(`Too many notes: ${notes.length} notes for ${taskNames.length} tasks. Each task should have exactly one note.`);
    }

    // Check for duplicate task names
    const duplicates = taskNames.filter((name, index) => taskNames.indexOf(name) !== index);
    if (duplicates.length > 0) {
      const uniqueDuplicates = [...new Set(duplicates)];
      errors.push(`Duplicate task names found: ${uniqueDuplicates.join(', ')}. Task names must be unique.`);
    }

    // Check if we have any tasks at all
    if (taskNames.length === 0) {
      errors.push('Please enter at least one task name.');
    }

    // Check if we have any notes at all
    if (notes.length === 0) {
      errors.push('Please enter at least one note.');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const getAllTasksFromList = async (taskListId) => {
    const allTasks = [];
    let pageToken = null;
    
    try {
      do {
        const params = {
          tasklist: taskListId,
          maxResults: 100
        };
        
        if (pageToken) {
          params.pageToken = pageToken;
        }
        
        const response = await window.gapi.client.tasks.tasks.list(params);
        const tasks = response.result.items || [];
        allTasks.push(...tasks);
        pageToken = response.result.nextPageToken;
        
        // Small delay to respect rate limits
        if (pageToken) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
      } while (pageToken);
      
      return allTasks;
    } catch (error) {
      console.error('Error fetching all tasks:', error);
      throw error;
    }
  };

  const updateTaskNotes = async (taskId, taskListId, notes, existingTask) => {
    try {
      // Preserve all existing task fields and only update the notes
      const updatedTask = {
        ...existingTask,
        notes: notes
      };
      
      const response = await window.gapi.client.tasks.tasks.update({
        tasklist: taskListId,
        task: taskId,
        resource: updatedTask
      });
      
      return response.result;
    } catch (error) {
      console.error('Error updating task notes:', error);
      throw error;
    }
  };

  const handleBulkSetNotes = async () => {
    if (!selectedNotesTaskList) {
      alert('Please select a task list first.');
      return;
    }

    if (!validateNotesInput()) {
      return;
    }

    const taskNames = taskNamesText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    const notes = notesText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    setIsSettingNotes(true);
    setNotesProgress({ current: 0, total: taskNames.length });
    setNotesStatus('Loading tasks from selected list...');

    try {
      // First, get all tasks from the selected list
      const allTasks = await getAllTasksFromList(selectedNotesTaskList);
      console.log(`Found ${allTasks.length} tasks in the list`);

      let successCount = 0;
      let failureCount = 0;
      const failures = [];
      const baseDelay = 200; // Base delay in ms (constant)
      let variableDelay = 100; // Variable delay in ms (min 100ms)
      const minVariableDelay = 100;
      const updatedTasks = []; // Track updated task IDs for verification

      for (let i = 0; i < taskNames.length; i++) {
        const taskName = taskNames[i];
        const noteText = notes[i] || ''; // Use empty string if no corresponding note
        let taskUpdated = false;
        
        while (!taskUpdated) {
          try {
            const totalDelay = baseDelay + variableDelay;
            setNotesStatus(`Processing ${i + 1} of ${taskNames.length}: Finding task "${taskName}"\n(delay: ${totalDelay}ms = ${baseDelay}+${variableDelay})`);
            setNotesProgress({ current: i, total: taskNames.length });
            
            // Find the task by name (case-insensitive)
            const matchingTask = allTasks.find(task => 
              task.title && task.title.toLowerCase() === taskName.toLowerCase()
            );
            
            if (!matchingTask) {
              throw new Error(`Task "${taskName}" not found in the selected list`);
            }
            
            setNotesStatus(`Processing ${i + 1} of ${taskNames.length}: Setting notes for "${taskName}"\n(delay: ${totalDelay}ms = ${baseDelay}+${variableDelay})`);
            
            // Update the task with the note, preserving all existing fields
            const result = await updateTaskNotes(matchingTask.id, selectedNotesTaskList, noteText, matchingTask);
            
            // Verify the update was successful
            if (result && result.id) {
              updatedTasks.push({ id: matchingTask.id, title: taskName, index: i });
              console.log(`Successfully updated notes for task "${taskName}"`);
              successCount++;
              taskUpdated = true;
              
              // On success: reduce variable delay by 10ms (linear decrease, min 100ms)
              variableDelay = Math.max(variableDelay - 10, minVariableDelay);
            } else {
              throw new Error('Update did not return expected result');
            }
            
            // Rate limiting delay
            if (i < taskNames.length - 1) {
              await new Promise(resolve => setTimeout(resolve, baseDelay + variableDelay));
            }
            
          } catch (error) {
            // Check if it's a 403 quota exceeded error
            if (error.status === 403 || error.code === 403 || 
                (error.result && error.result.code === 403) ||
                (error.message && (error.message.toLowerCase().includes('quota') || error.message.toLowerCase().includes('rate limit')))) {
              // Double the variable delay
              variableDelay = variableDelay * 2;
              console.warn(`403 quota exceeded. Doubling variable delay to ${variableDelay}ms (total: ${baseDelay + variableDelay}ms)`);
              
              // Verify previous task if it exists
              if (updatedTasks.length > 0) {
                const prevTask = updatedTasks[updatedTasks.length - 1];
                console.log(`Verifying previous task: ${prevTask.title}`);
                try {
                  const verifyResponse = await window.gapi.client.tasks.tasks.get({
                    tasklist: selectedNotesTaskList,
                    task: prevTask.id
                  });
                  if (!verifyResponse.result || !verifyResponse.result.id) {
                    console.error(`Previous task verification failed: ${prevTask.title}`);
                    // Remove from updated tasks and retry
                    updatedTasks.pop();
                    successCount--;
                    i = prevTask.index; // Go back to retry previous task
                    taskUpdated = true; // Exit current task loop to retry previous
                    continue;
                  } else {
                    console.log(`Previous task verified successfully: ${prevTask.title}`);
                  }
                } catch (verifyError) {
                  console.error(`Error verifying previous task:`, verifyError);
                }
              }
              
              // Wait with increased delay before retrying current task
              await new Promise(resolve => setTimeout(resolve, baseDelay + variableDelay));
              // Loop will retry current task
              
            } else {
              // Not a quota error, don't retry
              console.error(`Failed to set notes for task "${taskName}":`, error);
              failureCount++;
              failures.push({ task: taskName, error: error.message });
              taskUpdated = true; // Move to next task
            }
          }
        }
      }
      
      setNotesProgress({ current: taskNames.length, total: taskNames.length });
      
      let statusMessage = `Bulk notes update completed! ${successCount} tasks updated successfully.`;
      if (failureCount > 0) {
        statusMessage += ` ${failureCount} tasks failed:\n`;
        const failedTaskNames = failures.map(failure => `• ${failure.task}: ${failure.error}`).join('\n');
        statusMessage += failedTaskNames;
        console.log('Failed tasks:', failures);
      }
      
      setNotesStatus(statusMessage);
      
    } catch (error) {
      console.error('Bulk notes update error:', error);
      setNotesStatus('Bulk notes update failed: ' + error.message);
    } finally {
      setIsSettingNotes(false);
    }
  };

  // Load tasks for auto notes preview
  const loadAutoNotesTasksPreview = async () => {
    if (!selectedAutoNotesTaskList) {
      setAutoNotesTasksPreview([]);
      setIsLoadingTasksPreview(false);
      return;
    }

    setIsLoadingTasksPreview(true);
    setAutoNotesStatus('');
    
    try {
      console.log(`Loading tasks from list: ${selectedAutoNotesTaskList}`);
      const allTasks = await getAllTasksFromList(selectedAutoNotesTaskList);
      console.log(`Loaded ${allTasks.length} tasks`);
      setAutoNotesTasksPreview(allTasks);
    } catch (error) {
      console.error('Error loading tasks preview:', error);
      setAutoNotesStatus('Failed to load tasks preview: ' + error.message);
      setAutoNotesTasksPreview([]);
    } finally {
      setIsLoadingTasksPreview(false);
    }
  };

  // Load tasks preview when auto notes task list changes
  useEffect(() => {
    if (selectedAutoNotesTaskList && isSignedIn) {
      loadAutoNotesTasksPreview();
    }
  }, [selectedAutoNotesTaskList, isSignedIn]);

  // YouTube URL detection and filtering functions
  const isYouTubeURL = (url) => {
    const youtubePatterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
      /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]+)/,
      /(?:https?:\/\/)?(?:m\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/
    ];
    
    return youtubePatterns.some(pattern => pattern.test(url));
  };

  const isYouTubeShort = (url) => {
    return /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/.test(url);
  };

  const extractVideoId = (url) => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
      /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]+)/,
      /(?:https?:\/\/)?(?:m\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  const filterTasksForProcessing = (tasks) => {
    return tasks.filter(task => {
      // Must have a YouTube URL in the title
      if (!isYouTubeURL(task.title)) {
        return false;
      }
      
      // Must not already have notes
      const hasNotes = task.notes && task.notes.trim() !== '';
      console.log(`Task "${task.title}": notes="${task.notes}", hasNotes=${hasNotes}`);
      
      if (hasNotes) {
        return false;
      }
      
      return true;
    });
  };

  // YouTube Data API functions
  const formatDuration = (duration) => {
    // Parse ISO 8601 duration format (PT4M13S, PT1H2M30S, etc.)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 'Unknown duration';
    
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    
    if (hours > 0) {
      if (minutes > 0) {
        return `${hours} hours ${minutes} minutes`;
      } else {
        return `${hours} hours`;
      }
    } else if (minutes > 0) {
      return `${minutes} min`;
    } else {
      return `${seconds} seconds`;
    }
  };

  const getVideoData = async (videoId) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        return {
          title: 'Video Unavailable',
          duration: 'Unknown',
          channelTitle: null,
          error: 'Video not found or private'
        };
      }
      
      const video = data.items[0];
      const duration = formatDuration(video.contentDetails.duration);
      const title = video.snippet.title;
      const channelTitle = video.snippet.channelTitle;
      const channelId = video.snippet.channelId;
      
      return {
        title,
        duration,
        channelTitle,
        channelId,
        error: null
      };
    } catch (error) {
      console.error('Error fetching video data:', error);
      return {
        title: 'Video Unavailable',
        duration: 'Unknown',
        channelTitle: null,
        channelId: null,
        error: error.message
      };
    }
  };

  const checkYouTubeSubscription = async (channelId) => {
    if (!channelId) return false;
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&forChannelId=${channelId}&key=${API_KEY}`,
        {
          headers: {
            'Authorization': `Bearer ${window.gapi.auth.getToken().access_token}`
          }
        }
      );
      
      if (!response.ok) {
        // If 403 or 401, it might be because the user hasn't granted YouTube permissions yet
        // We'll just return false and not treat it as a critical error
        console.warn(`YouTube subscription check failed: ${response.status}`);
        return false;
      }
      
      const data = await response.json();
      return data.items && data.items.length > 0;
    } catch (error) {
      console.error('Error checking YouTube subscription:', error);
      return false;
    }
  };

  const isMonitoredChannel = (channelName) => {
    const monitoredChannels = [
      'Phillip Defranco',
      'LegalEagle', 
      'LastWeekTonight',
      'Charisma On Command',
      'Simon Sinek',
      'Timothy Cain',
      'Hank Green',
      'The Diary of a CEO',
      'Mystic Arts',
      'MALINDA',
      'Shannon Morse',
      'Healthcare Triage',
      'AlexHormozi'
    ];
    
    return monitoredChannels.some(monitored => 
      channelName.toLowerCase().includes(monitored.toLowerCase()) ||
      monitored.toLowerCase().includes(channelName.toLowerCase())
    );
  };

  const generateNotesText = (videoData, isShort, isSubscribed = false) => {
    let notes = '';
    
    // Add duration (always include actual duration, even for shorts)
    notes += videoData.duration;
    
    // Add channel name if monitored OR subscribed
    if (videoData.channelTitle && (isMonitoredChannel(videoData.channelTitle) || isSubscribed)) {
      notes += ` - ${videoData.channelTitle}`;
    }
    
    // Add video title
    notes += ` - ${videoData.title}`;
    
    return notes;
  };

  const handleProcessYouTubeTasks = async () => {
    if (!selectedAutoNotesTaskList) {
      setAutoNotesStatus('Please select a task list first.');
      return;
    }

    setIsProcessingAutoNotes(true);
    setAutoNotesStatus('Analyzing tasks for YouTube URLs...');
    setAutoNotesProgress({ current: 0, total: 0 });

    try {
      // Get all tasks from the selected list
      const allTasks = await getAllTasksFromList(selectedAutoNotesTaskList);
      console.log(`Found ${allTasks.length} total tasks`);

      // Debug: Log first few tasks to see their structure
      console.log('Sample tasks structure:', allTasks.slice(0, 3).map(task => ({
        title: task.title,
        notes: task.notes,
        allFields: Object.keys(task)
      })));

      // Filter tasks that need processing
      const tasksToProcess = filterTasksForProcessing(allTasks);
      console.log(`Found ${tasksToProcess.length} YouTube tasks that need processing`);

      if (tasksToProcess.length === 0) {
        setAutoNotesStatus('No YouTube tasks found that need processing. Tasks must have YouTube URLs and no existing notes.');
        return;
      }

      setAutoNotesProgress({ current: 0, total: tasksToProcess.length });
      setAutoNotesStatus(`Found ${tasksToProcess.length} YouTube tasks to process. Starting video data extraction...`);

      let successCount = 0;
      let failureCount = 0;
      const failures = [];

      // Process each task
      for (let i = 0; i < tasksToProcess.length; i++) {
        const task = tasksToProcess[i];
        const videoId = extractVideoId(task.title);
        const isShort = isYouTubeShort(task.title);
        
        setAutoNotesProgress({ current: i, total: tasksToProcess.length });
        setAutoNotesStatus(`Processing ${i + 1} of ${tasksToProcess.length}: Getting video data for "${task.title}"`);
        
        try {
          // Get video data from YouTube API
          const videoData = await getVideoData(videoId);
          let isSubscribed = false;
          
          if (videoData.error) {
            throw new Error(videoData.error);
          }

          // Check subscription if not already monitored
          if (videoData.channelId && !isMonitoredChannel(videoData.channelTitle)) {
            setAutoNotesStatus(`Processing ${i + 1} of ${tasksToProcess.length}: Checking subscription for "${videoData.channelTitle}"...`);
            isSubscribed = await checkYouTubeSubscription(videoData.channelId);
            if (isSubscribed) {
              console.log(`User is subscribed to ${videoData.channelTitle}`);
            }
          }
          
          // Generate notes text
          const notesText = generateNotesText(videoData, isShort, isSubscribed);
          
          setAutoNotesStatus(`Processing ${i + 1} of ${tasksToProcess.length}: Updating task notes for "${task.title}"`);
          
          // Update the task with notes, preserving all existing fields
          await updateTaskNotes(task.id, selectedAutoNotesTaskList, notesText, task);
          
          console.log(`Successfully updated notes for task "${task.title}" with: "${notesText}"`);
          successCount++;
          
          // Rate limiting - wait between requests
          if (i < tasksToProcess.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 300)); // 300ms delay
          }
          
        } catch (error) {
          console.error(`Error processing task "${task.title}":`, error);
          failureCount++;
          failures.push({ task: task.title, error: error.message });
        }
      }
      
      setAutoNotesProgress({ current: tasksToProcess.length, total: tasksToProcess.length });
      
      let statusMessage = `YouTube tasks processing completed!\n\n${successCount} tasks updated successfully.`;
      if (failureCount > 0) {
        statusMessage += ` ${failureCount} tasks failed:\n`;
        const failedTaskNames = failures.map(failure => `• ${failure.task}: ${failure.error}`).join('\n');
        statusMessage += failedTaskNames;
        console.log('Failed tasks:', failures);
      }
      
      setAutoNotesStatus(statusMessage);

    } catch (error) {
      console.error('Error processing YouTube tasks:', error);
      setAutoNotesStatus('Error processing tasks: ' + error.message);
    } finally {
      setIsProcessingAutoNotes(false);
    }
  };

  // Generate tabs array for easy expansion
  const tabs = Array.from({ length: 10 }, (_, i) => i + 1);

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return (
          <div className="tab-content">
            <h2>Bulk Insert Tasks</h2>
            {initError && !isSignedIn && (
              <div className="error-message">
                <p><strong>Setup Required:</strong> {initError}</p>
                <p>Please follow the setup instructions in credentials-setup.md</p>
              </div>
            )}
            {isSignedIn ? (
              <div className="bulk-insert-container">
                {/* Task List Selection */}
                <div className="task-list-selection-section">
                  <h4>Select Task List</h4>
                  <div className="form-group">
                    <label htmlFor="taskListSelect">Choose a task list to add tasks to:</label>
                    <select
                      id="taskListSelect"
                      value={selectedTaskList}
                      onChange={(e) => setSelectedTaskList(e.target.value)}
                      className="form-select"
                      disabled={isInserting}
                    >
                      <option value="">Choose a task list...</option>
                      {taskLists.map(list => (
                        <option key={list.id} value={list.id}>
                          {list.title}
                        </option>
                      ))}
                    </select>
                    {taskLists.length === 0 && (
                      <p className="form-help">Loading task lists...</p>
                    )}
                  </div>
                </div>

                {/* Bulk Tasks Input */}
                <div className="bulk-input-section">
                  <h4>Tasks to Insert</h4>
                  <div className="form-group">
                    <label htmlFor="bulkTasksInput">Enter task titles (one per line):</label>
                    <textarea
                      id="bulkTasksInput"
                      value={bulkTasksText}
                      onChange={(e) => setBulkTasksText(e.target.value)}
                      placeholder="Enter task titles, one per line..."
                      rows="10"
                      className="form-textarea"
                      disabled={isInserting}
                    />
                    <p className="form-help">
                      Enter each task on a new line. Empty lines will be ignored.
                    </p>
                  </div>
                </div>

                {/* Insert Button */}
                <div className="form-group">
                  <button
                    onClick={handleBulkInsert}
                    disabled={isInserting || !selectedTaskList || bulkTasksText.trim().length === 0}
                    className="insert-btn"
                  >
                    {isInserting ? 'Inserting Tasks...' : 'Insert Tasks'}
                  </button>
                </div>

                {/* Progress Bar */}
                {isInserting && (
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${insertProgress.total > 0 ? (insertProgress.current / insertProgress.total) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <p className="progress-text">
                      {insertProgress.current} of {insertProgress.total} tasks processed
                    </p>
                  </div>
                )}

                {/* Status Messages */}
                {insertStatus && (
                  <div className="status-message">
                    <p>{insertStatus}</p>
                  </div>
                )}


              </div>
            ) : (
              <div>
                <p>Please sign in to use the bulk insert feature.</p>
                {initError && (
                  <p className="error-note">Note: You need to configure your API credentials first.</p>
                )}
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="tab-content">
            <h2>Bulk Set Notes</h2>
            {initError && !isSignedIn && (
              <div className="error-message">
                <p><strong>Setup Required:</strong> {initError}</p>
                <p>Please follow the setup instructions in credentials-setup.md</p>
              </div>
            )}
            {isSignedIn ? (
              <div className="bulk-notes-container">
                {/* Task List Selector */}
                <div className="form-group">
                  <label htmlFor="notesTaskListSelect" className="form-label">
                    Select Task List:
                  </label>
                  <select
                    id="notesTaskListSelect"
                    value={selectedNotesTaskList}
                    onChange={(e) => setSelectedNotesTaskList(e.target.value)}
                    className="form-select"
                    disabled={isSettingNotes}
                  >
                    <option value="">Choose a task list...</option>
                    {taskLists.map(list => (
                      <option key={list.id} value={list.id}>
                        {list.title}
                      </option>
                    ))}
                  </select>
                  {taskLists.length === 0 && (
                    <p className="form-help">Loading task lists...</p>
                  )}
                </div>

                {/* Side-by-side text areas */}
                <div className="side-by-side-container">
                  {/* Task Names Input */}
                  <div className="form-group half-width">
                    <label htmlFor="taskNames" className="form-label">
                      Task Names (one per line):
                    </label>
                    <textarea
                      id="taskNames"
                      value={taskNamesText}
                      onChange={(e) => {
                        setTaskNamesText(e.target.value);
                        setValidationErrors([]); // Clear errors when user types
                      }}
                      className="form-textarea"
                      placeholder="Enter task names here:&#10;&#10;Cow&#10;Cat&#10;Dog"
                      rows={8}
                      disabled={isSettingNotes}
                    />
                    <p className="form-help">
                      {taskNamesText.split('\n').filter(line => line.trim().length > 0).length} task names entered
                    </p>
                  </div>

                  {/* Notes Input */}
                  <div className="form-group half-width">
                    <label htmlFor="taskNotes" className="form-label">
                      Notes (one per line):
                    </label>
                    <textarea
                      id="taskNotes"
                      value={notesText}
                      onChange={(e) => {
                        setNotesText(e.target.value);
                        setValidationErrors([]); // Clear errors when user types
                      }}
                      className="form-textarea"
                      placeholder="Enter notes here:&#10;&#10;Moo&#10;Meow&#10;Woof"
                      rows={8}
                      disabled={isSettingNotes}
                    />
                    <p className="form-help">
                      {notesText.split('\n').filter(line => line.trim().length > 0).length} notes entered
                    </p>
                  </div>
                </div>

                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                  <div className="validation-errors">
                    <h4>Please fix the following issues:</h4>
                    <ul>
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Process Button */}
                <div className="form-group">
                  <button
                    onClick={handleBulkSetNotes}
                    disabled={isSettingNotes || !selectedNotesTaskList || taskNamesText.trim().length === 0 || notesText.trim().length === 0}
                    className="insert-btn"
                  >
                    {isSettingNotes ? 'Setting Notes...' : 'Set Notes'}
                  </button>
                </div>

                {/* Progress Bar */}
                {isSettingNotes && (
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${notesProgress.total > 0 ? (notesProgress.current / notesProgress.total) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <p className="progress-text">
                      {notesProgress.current} of {notesProgress.total} tasks processed
                    </p>
                  </div>
                )}

                {/* Status Messages */}
                {notesStatus && (
                  <div className="status-message">
                    <p>{notesStatus}</p>
                  </div>
                )}


              </div>
            ) : (
              <div>
                <p>Please sign in to use the bulk set notes feature.</p>
                {initError && (
                  <p className="error-note">Note: You need to configure your API credentials first.</p>
                )}
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="tab-content">
            <h2>Automatic Notes Entry</h2>
            {initError && !isSignedIn && (
              <div className="error-message">
                <p><strong>Setup Required:</strong> {initError}</p>
                <p>Please follow the setup instructions in credentials-setup.md</p>
              </div>
            )}
            {isSignedIn ? (
              <div className="auto-notes-container">
                {/* Task List Selector */}
                <div className="form-group">
                  <label htmlFor="autoNotesTaskListSelect" className="form-label">
                    Select Task List:
                  </label>
                  <select
                    id="autoNotesTaskListSelect"
                    value={selectedAutoNotesTaskList}
                    onChange={(e) => setSelectedAutoNotesTaskList(e.target.value)}
                    className="form-select"
                    disabled={isProcessingAutoNotes}
                  >
                    <option value="">Choose a task list...</option>
                    {taskLists.map(list => (
                      <option key={list.id} value={list.id}>
                        {list.title}
                      </option>
                    ))}
                  </select>
                  {taskLists.length === 0 && (
                    <p className="form-help">Loading task lists...</p>
                  )}
                </div>

                {/* Tasks Preview */}
                {selectedAutoNotesTaskList && (
                  <div className="tasks-preview-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3>Tasks in {taskLists.find(list => list.id === selectedAutoNotesTaskList)?.title || 'Selected List'}:</h3>
                      <button 
                        onClick={loadAutoNotesTasksPreview}
                        disabled={isLoadingTasksPreview}
                        className="refresh-btn"
                        style={{ 
                          padding: '0.5rem 1rem', 
                          fontSize: '0.875rem',
                          background: '#f3f4f6',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {isLoadingTasksPreview ? 'Refreshing...' : 'Refresh'}
                      </button>
                    </div>
                    
                    {isLoadingTasksPreview ? (
                      <div className="loading-container">
                        <div className="throbber"></div>
                        <p>Loading tasks...</p>
                      </div>
                    ) : autoNotesTasksPreview.length > 0 ? (
                      <>
                        <p className="tasks-count">{autoNotesTasksPreview.length} total tasks</p>
                        <div className="tasks-preview-container">
                          {autoNotesTasksPreview.slice(0, 20).map(task => (
                            <div key={task.id} className="task-preview-item">
                              <div className="task-title">{task.title}</div>
                              <div className={`task-notes-status ${(task.notes && task.notes.trim() !== '') ? 'has-notes' : 'no-notes'}`}>
                                {(task.notes && task.notes.trim() !== '') ? 'Has notes' : 'No notes'}
                              </div>
                            </div>
                          ))}
                          {autoNotesTasksPreview.length > 20 && (
                            <div className="more-tasks-indicator">
                              ... and {autoNotesTasksPreview.length - 20} more tasks
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="empty-list-message">
                        <p>This task list is empty.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Monitored Channels List */}
                <div className="channels-section">
                  <h3>Monitored YouTube Channels:</h3>
                  <div className="channels-list">
                    <div className="channel-item">Phillip Defranco</div>
                    <div className="channel-item">LegalEagle</div>
                    <div className="channel-item">LastWeekTonight</div>
                    <div className="channel-item">Charisma On Command</div>
                    <div className="channel-item">Simon Sinek</div>
                    <div className="channel-item">Timothy Cain</div>
                    <div className="channel-item">Hank Green</div>
                    <div className="channel-item">The Diary of a CEO</div>
                    <div className="channel-item">Mystic Arts</div>
                    <div className="channel-item">MALINDA</div>
                    <div className="channel-item">Shannon Morse</div>
                    <div className="channel-item">Healthcare Triage</div>
                    <div className="channel-item">AlexHormozi</div>
                  </div>
                  <p className="channels-help">
                    Only videos from these channels will include the channel name in the notes.
                  </p>
                </div>

                {/* Process Button */}
                <div className="form-group">
                  <button
                    onClick={handleProcessYouTubeTasks}
                    disabled={isProcessingAutoNotes || !selectedAutoNotesTaskList}
                    className="insert-btn"
                  >
                    {isProcessingAutoNotes ? 'Processing...' : 'Process YouTube Tasks'}
                  </button>
                  <p className="form-help">
                    This will find YouTube tasks without notes, extract video data, and automatically generate notes with duration, channel (if monitored), and title.
                  </p>
                </div>

                {/* Progress Bar */}
                {isProcessingAutoNotes && (
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${autoNotesProgress.total > 0 ? (autoNotesProgress.current / autoNotesProgress.total) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <p className="progress-text">
                      {autoNotesProgress.current} of {autoNotesProgress.total} tasks processed
                    </p>
                  </div>
                )}

                {/* Status Messages */}
                {autoNotesStatus && (
                  <div className="status-message">
                    <p>{autoNotesStatus}</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p>Please sign in to use the automatic notes entry feature.</p>
                {initError && (
                  <p className="error-note">Note: You need to configure your API credentials first.</p>
                )}
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="tab-content">
            <h2>Due Date Management</h2>
            {isSignedIn ? (
              <>
            {/* Task List Selection */}
            <div className="task-list-selection-section">
              <h4>Select Task List</h4>
              <div className="form-group">
                <label htmlFor="dueDateTaskList">Choose a task list to manage:</label>
                <select
                  id="dueDateTaskList"
                  value={selectedDueDateTaskList}
                  onChange={(e) => setSelectedDueDateTaskList(e.target.value)}
                  onFocus={() => {
                    // Refresh task lists when dropdown is focused
                    if (isSignedIn && !loading) {
                      loadTaskLists();
                    }
                  }}
                  disabled={!isSignedIn || isLoadingDueDateTasks}
                  className="form-select"
                >
                  <option value="">Choose a task list...</option>
                  {taskLists.map(list => (
                    <option key={list.id} value={list.id}>{list.title}</option>
                  ))}
                </select>
                {isLoadingDueDateTasks && (
                  <p className="form-help">Loading tasks...</p>
                )}
              </div>
            </div>

            {/* Search and Filter Controls */}
            {selectedDueDateTaskList && (
              <div className="search-filter-section">
                <h4>Search & Filter Tasks</h4>
                <div className="search-controls">
                  <div className="search-row">
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={dueDateSearchTerm}
                      onChange={(e) => setDueDateSearchTerm(e.target.value)}
                      disabled={isLoadingDueDateTasks}
                      className="search-input"
                    />
                    
                    {/* Case Sensitivity Radio Buttons */}
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="caseSensitivity"
                          checked={dueDateCaseSensitive}
                          onChange={() => setDueDateCaseSensitive(true)}
                          disabled={isLoadingDueDateTasks}
                        />
                        Case sensitive
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="caseSensitivity"
                          checked={!dueDateCaseSensitive}
                          onChange={() => setDueDateCaseSensitive(false)}
                          disabled={isLoadingDueDateTasks}
                        />
                        Case insensitive
                      </label>
                    </div>
                  </div>
                  
                  <div className="filter-row">
                    <div className="sort-controls">
                      <label htmlFor="dueDateSortField">Sort Field:</label>
                      <select
                        id="dueDateSortField"
                        value={dueDateSortField}
                        onChange={(e) => setDueDateSortField(e.target.value)}
                        disabled={isLoadingDueDateTasks}
                        className="form-select"
                      >
                        <option value="title">Title</option>
                        <option value="notes">Notes</option>
                      </select>
                    </div>
                    
                    <div className="sort-controls">
                      <label htmlFor="dueDateSort">Sort Order:</label>
                      <select
                        id="dueDateSort"
                        value={dueDateSortBy}
                        onChange={(e) => setDueDateSortBy(e.target.value)}
                        disabled={isLoadingDueDateTasks}
                        className="form-select"
                      >
                        <option value="alphabetical">A-Z</option>
                        <option value="alphabetical-desc">Z-A</option>
                        <option value="creation-date">Creation Date (Oldest)</option>
                        <option value="creation-date-desc">Creation Date (Newest)</option>
                        <option value="due-date">Due Date (Earliest)</option>
                        <option value="due-date-desc">Due Date (Latest)</option>
                        <option value="duration">Duration (Shortest)</option>
                        <option value="duration-desc">Duration (Longest)</option>
                      </select>
                    </div>
                    
                    <div className="sort-controls">
                      <label htmlFor="dueDateTaskType">Task Type:</label>
                      <select
                        id="dueDateTaskType"
                        value={dueDateTaskTypeFilter}
                        onChange={(e) => setDueDateTaskTypeFilter(e.target.value)}
                        disabled={isLoadingDueDateTasks}
                        className="form-select"
                      >
                        <option value="all">All</option>
                        <option value="parent">Parent</option>
                        <option value="child">Child</option>
                        <option value="standalone">Standalone</option>
                      </select>
                    </div>
                    
                    {/* Hide Tasks with Due Dates Filter */}
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={dueDateHideTasksWithDueDates}
                        onChange={(e) => setDueDateHideTasksWithDueDates(e.target.checked)}
                        disabled={isLoadingDueDateTasks}
                      />
                      Hide tasks with due dates
                    </label>
                  </div>
                  
                  {/* Duration Filter */}
                  <div className="duration-filter-section">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={dueDateDurationFilter.enabled}
                        onChange={(e) => setDueDateDurationFilter({
                          ...dueDateDurationFilter,
                          enabled: e.target.checked
                        })}
                        disabled={isLoadingDueDateTasks}
                      />
                      Filter by duration (from notes)
                    </label>
                    
                    {dueDateDurationFilter.enabled && (
                      <>
                        <div className="duration-mode-selector">
                          <label className="radio-label">
                            <input
                              type="radio"
                              name="dueDateDurationMode"
                              checked={dueDateDurationFilter.mode === 'single'}
                              onChange={() => setDueDateDurationFilter({
                                ...dueDateDurationFilter,
                                mode: 'single'
                              })}
                              disabled={isLoadingDueDateTasks}
                            />
                            Single value
                          </label>
                          <label className="radio-label">
                            <input
                              type="radio"
                              name="dueDateDurationMode"
                              checked={dueDateDurationFilter.mode === 'range'}
                              onChange={() => setDueDateDurationFilter({
                                ...dueDateDurationFilter,
                                mode: 'range'
                              })}
                              disabled={isLoadingDueDateTasks}
                            />
                            Range
                          </label>
                        </div>

                        {dueDateDurationFilter.mode === 'single' ? (
                          <div className="duration-controls">
                            <select
                              value={dueDateDurationFilter.operator}
                              onChange={(e) => setDueDateDurationFilter({
                                ...dueDateDurationFilter,
                                operator: e.target.value
                              })}
                              disabled={isLoadingDueDateTasks}
                              className="form-select duration-operator"
                            >
                              <option value="less">Less than</option>
                              <option value="greater">Greater than</option>
                              <option value="equal">Equal to</option>
                            </select>
                            
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              value={dueDateDurationFilter.value}
                              onChange={(e) => setDueDateDurationFilter({
                                ...dueDateDurationFilter,
                                value: e.target.value
                              })}
                              disabled={isLoadingDueDateTasks}
                              className="form-input duration-value"
                              placeholder="0"
                            />
                            
                            <select
                              value={dueDateDurationFilter.unit}
                              onChange={(e) => setDueDateDurationFilter({
                                ...dueDateDurationFilter,
                                unit: e.target.value
                              })}
                              disabled={isLoadingDueDateTasks}
                              className="form-select duration-unit"
                            >
                              <option value="seconds">Seconds</option>
                              <option value="minutes">Minutes</option>
                              <option value="hours">Hours</option>
                              <option value="days">Days</option>
                            </select>
                          </div>
                        ) : (
                          <div className="duration-controls">
                            <span className="duration-label">Between</span>
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              value={dueDateDurationFilter.valueMin}
                              onChange={(e) => setDueDateDurationFilter({
                                ...dueDateDurationFilter,
                                valueMin: e.target.value
                              })}
                              disabled={isLoadingDueDateTasks}
                              className="form-input duration-value"
                              placeholder="Min"
                            />
                            <span className="duration-label">and</span>
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              value={dueDateDurationFilter.valueMax}
                              onChange={(e) => setDueDateDurationFilter({
                                ...dueDateDurationFilter,
                                valueMax: e.target.value
                              })}
                              disabled={isLoadingDueDateTasks}
                              className="form-input duration-value"
                              placeholder="Max"
                            />
                            <select
                              value={dueDateDurationFilter.unit}
                              onChange={(e) => setDueDateDurationFilter({
                                ...dueDateDurationFilter,
                                unit: e.target.value
                              })}
                              disabled={isLoadingDueDateTasks}
                              className="form-select duration-unit"
                            >
                              <option value="seconds">Seconds</option>
                              <option value="minutes">Minutes</option>
                              <option value="hours">Hours</option>
                              <option value="days">Days</option>
                            </select>
                          </div>
                        )}
                      </>
                    )}
                    
                    <p className="duration-help-text">
                      Recognizes: 5s, 30 seconds, 5min, 10 minutes, 2h, 1 hour, 30m, 3 hours, 1d, 2 days, etc.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Task Selection Section */}
            {selectedDueDateTaskList && !isLoadingDueDateTasks && (
              <div className="task-selection-section">
                <h4>Task Selection</h4>
                <p className="section-description">Select tasks to assign due dates ({getFilteredDueDateTasks().length} tasks available)</p>
                
                <div className="task-management-section">
                  <div className="task-columns">
                    {/* Available Tasks Column */}
                    <div className="task-column">
                      <div className="column-header">
                        <h3>Available Tasks ({getFilteredDueDateTasks().length})</h3>
                        <div className="selection-controls">
                          <button 
                            className="select-btn"
                            onClick={selectAllFilteredTasks}
                            disabled={getFilteredDueDateTasks().length === 0}
                          >
                            Select All
                          </button>
                        </div>
                      </div>
                      
                      <div className="task-list">
                        {getFilteredDueDateTasks().length === 0 ? (
                          <p>No tasks found. Try adjusting your filters or search terms.</p>
                        ) : (
                          getFilteredDueDateTasks().map(task => (
                            <div key={task.id} className="task-item">
                              <input
                                type="checkbox"
                                checked={dueDateSelectedTasks.some(t => t.id === task.id)}
                                onChange={() => toggleTaskSelection(task)}
                                style={{ marginRight: '0.5rem', flexShrink: 0 }}
                              />
                              <div style={{ flex: 1 }}>
                                <span className="task-title">{task.title}</span>
                                {task.notes && (
                                  <div className="task-notes">{task.notes}</div>
                                )}
                                {task.due && (
                                  <span className="task-due-date">
                                    Due: {new Date(task.due).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Selected Tasks Column */}
                    <div className="task-column">
                      <div className="column-header">
                        <h3>Selected Tasks ({dueDateSelectedTasks.length})</h3>
                        <div className="selection-controls">
                          <button 
                            className="select-btn"
                            onClick={clearAllSelectedTasks}
                            disabled={dueDateSelectedTasks.length === 0}
                          >
                            Clear All
                          </button>
                        </div>
                      </div>
                      
                      <div className="task-list">
                        {dueDateSelectedTasks.length === 0 ? (
                          <p>No tasks selected. Check tasks from the left column to select them.</p>
                        ) : (
                          dueDateSelectedTasks.map(task => (
                            <div key={task.id} className="task-item selected">
                              <span className="task-title">{task.title}</span>
                              {task.notes && (
                                <div className="task-notes">{task.notes}</div>
                              )}
                              {task.due && (
                                <span className="task-due-date">
                                  Current due: {new Date(task.due).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Date Assignment & Recurrence Section */}
            {dueDateSelectedTasks.length > 0 && (
              <div className="date-assignment-section">
                <h4>Date Assignment & Recurrence</h4>
                <p className="section-description">Configure due dates for {dueDateSelectedTasks.length} selected task{dueDateSelectedTasks.length !== 1 ? 's' : ''}</p>
                
                <div className="date-assignment-controls">
                  {/* Start Date */}
                  <div className="form-group">
                    <label htmlFor="dueDateStartDate">Start Date:</label>
                    <input
                      type="date"
                      id="dueDateStartDate"
                      value={dueDateStartDate}
                      onChange={(e) => setDueDateStartDate(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  {/* Frequency Type */}
                  <div className="form-group">
                    <label htmlFor="dueDateFrequency">Frequency:</label>
                    <select
                      id="dueDateFrequency"
                      value={dueDateRecurrenceType}
                      onChange={(e) => setDueDateRecurrenceType(e.target.value)}
                      className="form-select"
                    >
                      <option value="none">No frequency</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  {/* Frequency Interval */}
                  {dueDateRecurrenceType !== 'none' && (
                    <div className="form-group">
                      <label htmlFor="dueDateInterval">
                        Repeat every:
                      </label>
                      <div className="interval-controls">
                        <input
                          type="number"
                          id="dueDateInterval"
                          min="1"
                          max="365"
                          value={dueDateRecurrenceInterval}
                          onChange={(e) => setDueDateRecurrenceInterval(Math.max(1, parseInt(e.target.value) || 1))}
                          className="form-input interval-input"
                        />
                        <span className="interval-label">
                          {dueDateRecurrenceType === 'daily' && (dueDateRecurrenceInterval === 1 ? 'day' : 'days')}
                          {dueDateRecurrenceType === 'weekly' && (dueDateRecurrenceInterval === 1 ? 'week' : 'weeks')}
                          {dueDateRecurrenceType === 'monthly' && (dueDateRecurrenceInterval === 1 ? 'month' : 'months')}
                        </span>
                      </div>
                      <p className="form-help">
                        {dueDateRecurrenceType === 'daily' && `Dates will be ${dueDateRecurrenceInterval} day${dueDateRecurrenceInterval !== 1 ? 's' : ''} apart`}
                        {dueDateRecurrenceType === 'weekly' && `Dates will be ${dueDateRecurrenceInterval} week${dueDateRecurrenceInterval !== 1 ? 's' : ''} apart`}
                        {dueDateRecurrenceType === 'monthly' && `Dates will be ${dueDateRecurrenceInterval} month${dueDateRecurrenceInterval !== 1 ? 's' : ''} apart`}
                      </p>
                    </div>
                  )}



                  {/* Date Preview */}
                  {dueDateStartDate && dueDateSelectedTasks.length > 0 && (
                    <div className="form-group">
                      <label>Date Preview:</label>
                      <div className="date-preview">
                        {dueDateSelectedTasks.slice(0, 5).map((task, index) => {
                          // Parse date correctly to avoid timezone issues
                          const [year, month, day] = dueDateStartDate.split('-').map(Number);
                          let date = new Date(year, month - 1, day);
                          
                          if (dueDateRecurrenceType !== 'none' && index > 0) {
                            if (dueDateRecurrenceType === 'daily') {
                              date.setDate(date.getDate() + (index * dueDateRecurrenceInterval));
                            } else if (dueDateRecurrenceType === 'weekly') {
                              date.setDate(date.getDate() + (index * dueDateRecurrenceInterval * 7));
                            } else if (dueDateRecurrenceType === 'monthly') {
                              date.setMonth(date.getMonth() + (index * dueDateRecurrenceInterval));
                            }
                          }
                          
                          return (
                            <div key={task.id} className="preview-item">
                              <span className="preview-task">{index + 1}. {task.title}</span>
                              <span className="preview-date">{date.toLocaleDateString()}</span>
                            </div>
                          );
                        })}
                        {dueDateSelectedTasks.length > 5 && (
                          <div className="preview-item">
                            <span className="preview-more">... and {dueDateSelectedTasks.length - 5} more {dueDateSelectedTasks.length - 5 === 1 ? 'task' : 'tasks'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Progress Display */}
                  {isAssigningDueDates && (
                    <div className="form-group">
                      <div className="progress-container">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ 
                              width: `${dueDateAssignmentProgress.total > 0 ? (dueDateAssignmentProgress.current / dueDateAssignmentProgress.total) * 100 : 0}%` 
                            }}
                          />
                        </div>
                        <p className="progress-text">
                          {dueDateAssignmentStatus} ({dueDateAssignmentProgress.current}/{dueDateAssignmentProgress.total})
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Status Display */}
                  {dueDateAssignmentStatus && !isAssigningDueDates && (
                    <div className="form-group">
                      <p className="status-message">{dueDateAssignmentStatus}</p>
                    </div>
                  )}

                  {/* Assign Button */}
                  <div className="form-group">
                    <button 
                      className="assign-btn" 
                      onClick={handleDueDateAssignment}
                      disabled={!dueDateStartDate || dueDateSelectedTasks.length === 0 || isAssigningDueDates}
                    >
                      {isAssigningDueDates ? (
                        'Assigning Due Dates...'
                      ) : (
                        `Assign Due Dates to ${dueDateSelectedTasks.length} Task${dueDateSelectedTasks.length !== 1 ? 's' : ''}`
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
            </>
            ) : (
              <p>Please sign in to use the due date management feature.</p>
            )}
          </div>
        );
      case 5:
        return (
          <div className="tab-content">
            <h2>Bulk Move Tasks</h2>
            {isSignedIn ? (
              <>
            {/* Task List Selection */}
            <div className="task-list-selection-section">
              <h4>Select Task Lists</h4>
              <div className="form-group">
                <label htmlFor="bulkMoveSourceList">Source Task List:</label>
                <select
                  id="bulkMoveSourceList"
                  value={bulkMoveSourceList}
                  onChange={(e) => setBulkMoveSourceList(e.target.value)}
                  onFocus={() => {
                    if (isSignedIn && !loading) {
                      loadTaskLists();
                    }
                  }}
                  disabled={isMovingTasks}
                  className="form-select"
                >
                  <option value="">Choose source list...</option>
                  {taskLists.map(list => (
                    <option key={list.id} value={list.id}>{list.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="bulkMoveDestinationList">Destination Task List:</label>
                <select
                  id="bulkMoveDestinationList"
                  value={bulkMoveDestinationList}
                  onChange={(e) => setBulkMoveDestinationList(e.target.value)}
                  disabled={isMovingTasks}
                  className="form-select"
                >
                  <option value="">Choose destination list...</option>
                  {taskLists.map(list => (
                    <option key={list.id} value={list.id}>{list.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {isLoadingBulkMoveTasks ? (
              <div className="loading-container">
                <div className="throbber"></div>
                <p>Loading tasks...</p>
              </div>
            ) : bulkMoveSourceList ? (
              <>
                {/* Search and Filter Controls */}
                <div className="search-filter-section">
                  <h4>Search & Filter Tasks</h4>
                  <div className="search-controls">
                    <div className="search-row">
                      <input
                        type="text"
                        placeholder="Search tasks..."
                        value={bulkMoveSearchTerm}
                        onChange={(e) => setBulkMoveSearchTerm(e.target.value)}
                        disabled={isMovingTasks}
                        className="search-input"
                      />
                      
                      {/* Case Sensitivity Radio Buttons - Stacked Vertically */}
                      <div className="radio-group-vertical">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="bulkMoveCaseSensitivity"
                            checked={bulkMoveCaseSensitive}
                            onChange={() => setBulkMoveCaseSensitive(true)}
                            disabled={isMovingTasks}
                          />
                          Case sensitive
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="bulkMoveCaseSensitivity"
                            checked={!bulkMoveCaseSensitive}
                            onChange={() => setBulkMoveCaseSensitive(false)}
                            disabled={isMovingTasks}
                          />
                          Case insensitive
                        </label>
                      </div>
                    </div>

                    <div className="filter-row">
                      <div className="sort-controls">
                        <label htmlFor="bulkMoveSortField">Search/Filter Field:</label>
                        <select
                          id="bulkMoveSortField"
                          value={bulkMoveSortField}
                          onChange={(e) => setBulkMoveSortField(e.target.value)}
                          disabled={isMovingTasks}
                          className="form-select"
                        >
                          <option value="title">Title</option>
                          <option value="notes">Notes</option>
                        </select>
                      </div>
                      
                      <div className="sort-controls">
                        <label htmlFor="bulkMoveSort">Sort by:</label>
                        <select
                          id="bulkMoveSort"
                          value={bulkMoveSortBy}
                          onChange={(e) => setBulkMoveSortBy(e.target.value)}
                          disabled={isMovingTasks}
                          className="form-select"
                        >
                          <option value="alphabetical">Alphabetical (A-Z)</option>
                          <option value="alphabetical-desc">Alphabetical (Z-A)</option>
                          <option value="creation">Creation Order</option>
                          <option value="creation-desc">Creation Order (Reverse)</option>
                          <option value="duedate">Due Date (Earliest First)</option>
                          <option value="duedate-desc">Due Date (Latest First)</option>
                        </select>
                      </div>
                      
                      {/* Show Duplicates Checkbox */}
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={bulkMoveShowDuplicates}
                          onChange={(e) => setBulkMoveShowDuplicates(e.target.checked)}
                          disabled={isMovingTasks}
                        />
                        Show only duplicates
                      </label>
                    </div>

                    {/* Duration Filter */}
                    <div className="duration-filter-section">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={bulkMoveDurationFilter.enabled}
                          onChange={(e) => setBulkMoveDurationFilter({
                            ...bulkMoveDurationFilter,
                            enabled: e.target.checked
                          })}
                          disabled={isMovingTasks}
                        />
                        Filter by duration (from notes)
                      </label>
                      
                      {bulkMoveDurationFilter.enabled && (
                        <>
                          <div className="duration-mode-selector">
                            <label className="radio-label">
                              <input
                                type="radio"
                                name="durationMode"
                                checked={bulkMoveDurationFilter.mode === 'single'}
                                onChange={() => setBulkMoveDurationFilter({
                                  ...bulkMoveDurationFilter,
                                  mode: 'single'
                                })}
                                disabled={isMovingTasks}
                              />
                              Single value
                            </label>
                            <label className="radio-label">
                              <input
                                type="radio"
                                name="durationMode"
                                checked={bulkMoveDurationFilter.mode === 'range'}
                                onChange={() => setBulkMoveDurationFilter({
                                  ...bulkMoveDurationFilter,
                                  mode: 'range'
                                })}
                                disabled={isMovingTasks}
                              />
                              Range
                            </label>
                          </div>

                          {bulkMoveDurationFilter.mode === 'single' ? (
                            <div className="duration-controls">
                              <select
                                value={bulkMoveDurationFilter.operator}
                                onChange={(e) => setBulkMoveDurationFilter({
                                  ...bulkMoveDurationFilter,
                                  operator: e.target.value
                                })}
                                disabled={isMovingTasks}
                                className="form-select duration-operator"
                              >
                                <option value="less">Less than</option>
                                <option value="greater">Greater than</option>
                                <option value="equal">Equal to</option>
                              </select>
                              
                              <input
                                type="number"
                                min="0"
                                step="0.5"
                                value={bulkMoveDurationFilter.value}
                                onChange={(e) => setBulkMoveDurationFilter({
                                  ...bulkMoveDurationFilter,
                                  value: e.target.value
                                })}
                                disabled={isMovingTasks}
                                className="form-input duration-value"
                                placeholder="0"
                              />
                              
                              <select
                                value={bulkMoveDurationFilter.unit}
                                onChange={(e) => setBulkMoveDurationFilter({
                                  ...bulkMoveDurationFilter,
                                  unit: e.target.value
                                })}
                                disabled={isMovingTasks}
                                className="form-select duration-unit"
                              >
                                <option value="seconds">Seconds</option>
                                <option value="minutes">Minutes</option>
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                              </select>
                            </div>
                          ) : (
                            <div className="duration-controls">
                              <span className="duration-label">Between</span>
                              <input
                                type="number"
                                min="0"
                                step="0.5"
                                value={bulkMoveDurationFilter.valueMin}
                                onChange={(e) => setBulkMoveDurationFilter({
                                  ...bulkMoveDurationFilter,
                                  valueMin: e.target.value
                                })}
                                disabled={isMovingTasks}
                                className="form-input duration-value"
                                placeholder="Min"
                              />
                              <span className="duration-label">and</span>
                              <input
                                type="number"
                                min="0"
                                step="0.5"
                                value={bulkMoveDurationFilter.valueMax}
                                onChange={(e) => setBulkMoveDurationFilter({
                                  ...bulkMoveDurationFilter,
                                  valueMax: e.target.value
                                })}
                                disabled={isMovingTasks}
                                className="form-input duration-value"
                                placeholder="Max"
                              />
                              <select
                                value={bulkMoveDurationFilter.unit}
                                onChange={(e) => setBulkMoveDurationFilter({
                                  ...bulkMoveDurationFilter,
                                  unit: e.target.value
                                })}
                                disabled={isMovingTasks}
                                className="form-select duration-unit"
                              >
                                <option value="seconds">Seconds</option>
                                <option value="minutes">Minutes</option>
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                              </select>
                            </div>
                          )}
                        </>
                      )}
                      
                      <p className="duration-help-text">
                        Recognizes: 5s, 30 seconds, 5min, 10 minutes, 2h, 1 hour, 30m, 3 hours, 1d, 2 days, etc.
                      </p>
                    </div>

                    {/* Recurring Tasks Filter */}
                    <div className="recurring-filter-section">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={bulkMoveOmitRecurring}
                          onChange={(e) => setBulkMoveOmitRecurring(e.target.checked)}
                          disabled={isMovingTasks}
                        />
                        Omit recurring tasks
                      </label>
                    </div>

                    {/* Hierarchy Filter */}
                    <div className="hierarchy-filter-section">
                      <label style={{ fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>Task Types:</label>
                      <div className="hierarchy-checkboxes">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={bulkMoveHierarchyFilter.standalone}
                            onChange={(e) => setBulkMoveHierarchyFilter({
                              ...bulkMoveHierarchyFilter,
                              standalone: e.target.checked
                            })}
                            disabled={isMovingTasks}
                          />
                          Standalone tasks
                        </label>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={bulkMoveHierarchyFilter.parent}
                            onChange={(e) => setBulkMoveHierarchyFilter({
                              ...bulkMoveHierarchyFilter,
                              parent: e.target.checked
                            })}
                            disabled={isMovingTasks}
                          />
                          Parent tasks
                        </label>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={bulkMoveHierarchyFilter.child}
                            onChange={(e) => setBulkMoveHierarchyFilter({
                              ...bulkMoveHierarchyFilter,
                              child: e.target.checked
                            })}
                            disabled={isMovingTasks}
                          />
                          Child tasks
                        </label>
                      </div>
                    </div>

                    {/* Date Filter */}
                    <div className="date-filter-section">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={bulkMoveDateFilter.enabled}
                          onChange={(e) => setBulkMoveDateFilter({
                            ...bulkMoveDateFilter,
                            enabled: e.target.checked
                          })}
                          disabled={isMovingTasks}
                        />
                        Filter by due date
                      </label>
                      
                      {bulkMoveDateFilter.enabled && (
                        <div className="date-filter-controls" style={{ marginTop: '12px' }}>
                          {/* Mode Selection */}
                          <div className="filter-mode-row">
                            <label style={{ marginRight: '15px' }}>
                              <input
                                type="radio"
                                name="bulkMoveDateMode"
                                value="exact"
                                checked={bulkMoveDateFilter.mode === 'exact'}
                                onChange={(e) => setBulkMoveDateFilter({
                                  ...bulkMoveDateFilter,
                                  mode: e.target.value
                                })}
                                disabled={isMovingTasks}
                              />
                              Exact date
                            </label>
                            <label style={{ marginRight: '15px' }}>
                              <input
                                type="radio"
                                name="bulkMoveDateMode"
                                value="before"
                                checked={bulkMoveDateFilter.mode === 'before'}
                                onChange={(e) => setBulkMoveDateFilter({
                                  ...bulkMoveDateFilter,
                                  mode: e.target.value
                                })}
                                disabled={isMovingTasks}
                              />
                              On or before
                            </label>
                            <label style={{ marginRight: '15px' }}>
                              <input
                                type="radio"
                                name="bulkMoveDateMode"
                                value="after"
                                checked={bulkMoveDateFilter.mode === 'after'}
                                onChange={(e) => setBulkMoveDateFilter({
                                  ...bulkMoveDateFilter,
                                  mode: e.target.value
                                })}
                                disabled={isMovingTasks}
                              />
                              On or after
                            </label>
                            <label style={{ marginRight: '15px' }}>
                              <input
                                type="radio"
                                name="bulkMoveDateMode"
                                value="range"
                                checked={bulkMoveDateFilter.mode === 'range'}
                                onChange={(e) => setBulkMoveDateFilter({
                                  ...bulkMoveDateFilter,
                                  mode: e.target.value
                                })}
                                disabled={isMovingTasks}
                              />
                              Date range
                            </label>
                          </div>

                          {/* Date Input(s) */}
                          {bulkMoveDateFilter.mode === 'range' ? (
                            <div className="date-range-inputs">
                              <div className="date-input-group">
                                <label>From:</label>
                                <input
                                  type="date"
                                  value={bulkMoveDateFilter.dateStart}
                                  onChange={(e) => setBulkMoveDateFilter({
                                    ...bulkMoveDateFilter,
                                    dateStart: e.target.value
                                  })}
                                  disabled={isMovingTasks}
                                  className="form-input date-picker"
                                />
                              </div>
                              <div className="date-input-group">
                                <label>To:</label>
                                <input
                                  type="date"
                                  value={bulkMoveDateFilter.dateEnd}
                                  onChange={(e) => setBulkMoveDateFilter({
                                    ...bulkMoveDateFilter,
                                    dateEnd: e.target.value
                                  })}
                                  disabled={isMovingTasks}
                                  className="form-input date-picker"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="date-picker-container">
                              <input
                                type="date"
                                value={bulkMoveDateFilter.date}
                                onChange={(e) => setBulkMoveDateFilter({
                                  ...bulkMoveDateFilter,
                                  date: e.target.value
                                })}
                                disabled={isMovingTasks}
                                className="form-input date-picker"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="selection-controls">
                      <button onClick={selectAllBulkMoveTasks} disabled={isMovingTasks} className="select-btn">
                        Select Page
                      </button>
                      <button onClick={selectAllFilteredBulkMoveTasks} disabled={isMovingTasks} className="select-btn">
                        Select All Filtered
                      </button>
                      <button onClick={clearAllBulkMoveTasks} disabled={isMovingTasks} className="select-btn">
                        Clear Selection
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preset Filters - Separate Card */}
                <div className="preset-filters-section">
                  <h4>Preset Filters</h4>
                  <div className="preset-buttons-container">
                    <button
                      onClick={() => applyBulkMovePreset(1)}
                      className={`preset-btn ${bulkMoveActivePreset === 'preset1' ? 'active' : ''}`}
                      disabled={isMovingTasks}
                    >
                      Preset 1
                    </button>
                    <button
                      onClick={() => applyBulkMovePreset(2)}
                      className={`preset-btn ${bulkMoveActivePreset === 'preset2' ? 'active' : ''}`}
                      disabled={isMovingTasks}
                    >
                      Preset 2
                    </button>
                    <button
                      onClick={() => applyBulkMovePreset(3)}
                      className={`preset-btn ${bulkMoveActivePreset === 'preset3' ? 'active' : ''}`}
                      disabled={isMovingTasks}
                    >
                      Preset 3
                    </button>
                    <button
                      onClick={() => applyBulkMovePreset(4)}
                      className={`preset-btn ${bulkMoveActivePreset === 'preset4' ? 'active' : ''}`}
                      disabled={isMovingTasks}
                    >
                      Preset 4
                    </button>
                    <button
                      onClick={() => applyBulkMovePreset(5)}
                      className={`preset-btn ${bulkMoveActivePreset === 'preset5' ? 'active' : ''}`}
                      disabled={isMovingTasks}
                    >
                      Preset 5
                    </button>
                  </div>
                </div>

                {/* Filtered Tasks Output - Separate Card */}
                <div className="filtered-tasks-section">
                  <h4>Filtered Tasks ({bulkMoveSelectedTasks.length} selected)</h4>
                  
                  {(() => {
                    const pageData = getBulkMovePageData();
                    return (
                      <>
                        <div className="tasks-list">
                          {pageData.tasks.length > 0 ? (
                            pageData.tasks.map(task => (
                              <div
                                key={task.id}
                                className={`task-item ${bulkMoveSelectedTasks.some(t => t.id === task.id) ? 'selected' : ''}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={bulkMoveSelectedTasks.some(t => t.id === task.id)}
                                  onChange={() => toggleBulkMoveTaskSelection(task)}
                                  disabled={isMovingTasks}
                                />
                                <div className="task-info">
                                  <div className="task-title">{task.title}</div>
                                  {task.notes && (
                                    <div className="task-notes">{task.notes}</div>
                                  )}
                                  {task.status === 'completed' && (
                                    <span className="task-badge completed">Completed</span>
                                  )}
                                  {task.parent && (
                                    <span className="task-badge child">Child Task</span>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="no-tasks">No tasks found</p>
                          )}
                        </div>

                        {/* Pagination */}
                        {pageData.totalPages > 1 && (
                          <div className="pagination">
                            <button
                              onClick={() => setBulkMoveCurrentPage(prev => Math.max(1, prev - 1))}
                              disabled={bulkMoveCurrentPage === 1 || isMovingTasks}
                              className="select-btn"
                            >
                              Previous
                            </button>
                            <span>
                              Page {pageData.currentPage} of {pageData.totalPages} ({pageData.totalTasks} total tasks)
                            </span>
                            <button
                              onClick={() => setBulkMoveCurrentPage(prev => Math.min(pageData.totalPages, prev + 1))}
                              disabled={bulkMoveCurrentPage === pageData.totalPages || isMovingTasks}
                              className="select-btn"
                            >
                              Next
                            </button>
                          </div>
                        )}

                        {/* Select All Button at Bottom */}
                        <div className="bottom-select-all">
                          <button 
                            onClick={selectAllFilteredBulkMoveTasks}
                            disabled={isMovingTasks || filterAndSortBulkMoveTasks().length === 0}
                            className="select-btn"
                          >
                            Select All Filtered ({filterAndSortBulkMoveTasks().length} tasks)
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Progress Display */}
                {(isMovingTasks || moveStatus) && (
                  <div className="progress-section">
                    {isMovingTasks && (
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(moveProgress.current / moveProgress.total) * 100}%` }}
                        ></div>
                      </div>
                    )}
                    {isMovingTasks && (
                      <p className="progress-text">
                        {moveProgress.current} of {moveProgress.total} tasks moved
                      </p>
                    )}
                    {moveStatus && (
                      <p className="status-text">{moveStatus}</p>
                    )}
                  </div>
                )}

                {/* Move Button */}
                <div className="move-controls">
                  <button
                    onClick={moveBulkTasks}
                    disabled={
                      isMovingTasks || 
                      bulkMoveSelectedTasks.length === 0 || 
                      !bulkMoveSourceList ||
                      !bulkMoveDestinationList ||
                      bulkMoveSourceList === bulkMoveDestinationList
                    }
                    className="assign-btn"
                  >
                    {isMovingTasks ? 'Moving Tasks...' : `Move ${bulkMoveSelectedTasks.length} Selected Task(s)`}
                  </button>
                </div>
              </>
            ) : (
              <p className="instruction-text">Please select a source task list to begin.</p>
            )}
            </>
            ) : (
              <p>Please sign in to use the bulk move feature.</p>
            )}
          </div>
        );
      case 6:
        return (
          <div className="tab-content">
            <h2>Subtasks Management</h2>
            {isSignedIn ? (
              <>
            {/* Task List Selection */}
            <div className="task-list-selection-section">
              <h4>Select Task List</h4>
              <div className="form-group">
                <label htmlFor="subtasksTaskList">Choose a task list to manage subtasks:</label>
                <select
                  id="subtasksTaskList"
                  value={selectedSubtasksTaskList}
                  onChange={(e) => setSelectedSubtasksTaskList(e.target.value)}
                  onFocus={() => {
                    // Refresh task lists when dropdown is focused
                    if (isSignedIn && !loading) {
                      loadTaskLists();
                    }
                  }}
                  disabled={!isSignedIn || isLoadingSubtasksTasks}
                  className="form-select"
                >
                  <option value="">Choose a task list...</option>
                  {taskLists.map(list => (
                    <option key={list.id} value={list.id}>
                      {list.title}
                    </option>
                  ))}
                </select>
                {taskLists.length === 0 && (
                  <p className="form-help">Loading task lists...</p>
                )}
              </div>
            </div>

            {selectedSubtasksTaskList && (
              <>
                {/* Search and Filter Controls */}
                <div className="search-filter-section">
                  <h4>Search & Filter Tasks</h4>
                  <div className="search-controls">
                    <div className="search-row">
                      <input
                        type="text"
                        placeholder="Search tasks..."
                        value={subtasksSearchTerm}
                        onChange={(e) => setSubtasksSearchTerm(e.target.value)}
                        className="form-input search-input"
                      />
                      <div className="case-sensitivity-controls vertical">
                        <label>
                          <input
                            type="radio"
                            name="subtasksCaseSensitive"
                            checked={subtasksCaseSensitive}
                            onChange={() => setSubtasksCaseSensitive(true)}
                          />
                          Case sensitive
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="subtasksCaseSensitive"
                            checked={!subtasksCaseSensitive}
                            onChange={() => setSubtasksCaseSensitive(false)}
                          />
                          Case insensitive
                        </label>
                      </div>
                    </div>
                    <div className="filter-row">
                      <div className="form-group">
                        <label htmlFor="subtasksSortBy">Sort by:</label>
                        <select
                          id="subtasksSortBy"
                          value={subtasksSortBy}
                          onChange={(e) => setSubtasksSortBy(e.target.value)}
                          className="form-select"
                        >
                          <option value="alphabetical">Alphabetical (A-Z)</option>
                          <option value="alphabetical-desc">Alphabetical (Z-A)</option>
                          <option value="creation">Creation order (oldest first)</option>
                          <option value="creation-desc">Creation order (newest first)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Task Selection and Management */}
                <div className="task-selection-section">
                  <h4>Task Management</h4>
                  
                  {isLoadingSubtasksTasks ? (
                    <div className="loading-container">
                      <div className="throbber"></div>
                      <p>Loading tasks...</p>
                    </div>
                  ) : (
                    <>
                      {(() => {
                        const pageData = getSubtasksPageData();
                        return (
                          <>
                            <div className="task-columns">
                              {/* Available Tasks Column */}
                              <div className="task-column">
                                <h5>Available Tasks ({pageData.totalTasks} total)</h5>
                                <div className="task-list-container">
                                  {pageData.tasks.length > 0 ? (
                                    pageData.tasks.map(task => (
                                      <div key={task.id} className="task-item">
                                        <div className="task-content">
                                          <div className="task-checkbox">
                                            <input
                                              type="checkbox"
                                              checked={subtasksSelectedTasks.some(t => t.id === task.id)}
                                              onChange={() => toggleSubtaskSelection(task)}
                                              disabled={subtasksParentTask?.id === task.id}
                                            />
                                          </div>
                                          <div className="task-info">
                                            <div className="task-title">
                                              {task.parent && <span className="child-indicator">↳ </span>}
                                              {task.title || 'Untitled Task'}
                                            </div>
                                            {task.due && (
                                              <div className="task-due">
                                                Due: {new Date(task.due).toLocaleDateString()}
                                              </div>
                                            )}
                                            {task.parent && (
                                              <div className="task-parent">
                                                Child of: {subtasksTasks.find(t => t.id === task.parent)?.title || 'Unknown'}
                                              </div>
                                            )}
                                          </div>
                                          <div className="task-actions">
                                            <button
                                              onClick={(e) => {
                                                try {
                                                  e.preventDefault();
                                                  console.log('Button clicked for task:', task.id);
                                                  setParentTask(task);
                                                } catch (error) {
                                                  console.error('Button click error:', error);
                                                  alert('Button error: ' + error.message);
                                                }
                                              }}
                                              className={`parent-btn ${subtasksParentTask?.id === task.id ? 'active' : ''}`}
                                              disabled={subtasksSelectedTasks.some(t => t.id === task.id) || task.parent}
                                              title={task.parent ? 'This task is already a child and cannot be a parent' : 'Set this task as parent'}
                                            >
                                              {subtasksParentTask?.id === task.id ? 'Parent 👑' : 'Set Parent'}
                                            </button>
                                            {task.parent && (
                                              <button
                                                onClick={() => unsetTaskRelationship(task)}
                                                className="unset-btn"
                                                title="Remove parent-child relationship"
                                              >
                                                Unset
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="no-tasks">No tasks found</p>
                                  )}
                                </div>

                                {/* Pagination Controls */}
                                {pageData.totalPages > 1 && (
                                  <div className="pagination-controls">
                                    <button
                                      onClick={() => setSubtasksCurrentPage(prev => Math.max(1, prev - 1))}
                                      disabled={pageData.currentPage === 1}
                                      className="pagination-btn"
                                    >
                                      Previous
                                    </button>
                                    <span className="pagination-info">
                                      Page {pageData.currentPage} of {pageData.totalPages}
                                    </span>
                                    <button
                                      onClick={() => setSubtasksCurrentPage(prev => Math.min(pageData.totalPages, prev + 1))}
                                      disabled={pageData.currentPage === pageData.totalPages}
                                      className="pagination-btn"
                                    >
                                      Next
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Hierarchy Setup Column */}
                              <div className="task-column">
                                <h5>Hierarchy Setup</h5>
                                
                                {/* Parent Task Display */}
                                {subtasksParentTask && (
                                  <div className="parent-task-section">
                                    <h6>Parent Task:</h6>
                                    <div className="parent-task-display">
                                      <span className="parent-icon">👑</span>
                                      <span className="parent-title">{subtasksParentTask.title}</span>
                                      <button
                                        onClick={() => setSubtasksParentTask(null)}
                                        className="remove-parent-btn"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Child Task Selection Controls */}
                                <div className="selection-controls-section">
                                  <h6>Child Tasks ({subtasksSelectedTasks.length} selected):</h6>
                                  <div className="selection-buttons">
                                    <button
                                      onClick={selectAllExceptParent}
                                      disabled={!subtasksParentTask}
                                      className="select-all-btn"
                                    >
                                      Select All (except parent)
                                    </button>
                                    <button
                                      onClick={clearAllSubtasks}
                                      disabled={subtasksSelectedTasks.length === 0}
                                      className="clear-all-btn"
                                    >
                                      Clear All
                                    </button>
                                  </div>
                                </div>

                                {/* Selected Tasks Preview */}
                                {subtasksSelectedTasks.length > 0 && (
                                  <div className="selected-tasks-preview">
                                    <h6>Selected Child Tasks:</h6>
                                    <div className="selected-tasks-list">
                                      {subtasksSelectedTasks.slice(0, 5).map((task, index) => (
                                        <div key={task.id} className="selected-task-preview">
                                          <span className="task-number">{index + 1}.</span>
                                          <span className="task-title">{task.title}</span>
                                        </div>
                                      ))}
                                      {subtasksSelectedTasks.length > 5 && (
                                        <div className="more-tasks-indicator">
                                          ... and {subtasksSelectedTasks.length - 5} more tasks
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Instructions */}
                                <div className="instructions-section">
                                  <h6>How to use:</h6>
                                  <ol className="instructions-list">
                                    <li>Click "Set Parent" on a task in the left column</li>
                                    <li>Select child tasks using checkboxes or "Select All"</li>
                                    <li>Click "Set Relationships" to apply changes</li>
                                  </ol>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </>
                  )}
                </div>

                {/* Relationship Assignment */}
                {subtasksParentTask && subtasksSelectedTasks.length > 0 && (
                  <div className="relationship-assignment-section">
                    <h4>Set Parent-Child Relationships</h4>
                    <div className="relationship-preview">
                      <h6>Preview:</h6>
                      <div className="hierarchy-preview">
                        <div className="parent-preview">
                          <span className="parent-icon">👑</span>
                          <strong>{subtasksParentTask.title}</strong>
                        </div>
                        <div className="children-preview">
                          {subtasksSelectedTasks.map((child, index) => (
                            <div key={child.id} className="child-preview">
                              <span className="child-connector">├─</span>
                              <span className="child-number">{index + 1}.</span>
                              <span className="child-title">{child.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Progress Display */}
                    {(isSettingRelationships || relationshipStatus) && (
                      <div className="progress-section">
                        {isSettingRelationships && (
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${(relationshipProgress.current / relationshipProgress.total) * 100}%` }}
                            ></div>
                          </div>
                        )}
                        {isSettingRelationships && (
                          <p className="progress-text">
                            {relationshipProgress.current} of {relationshipProgress.total} relationships set
                          </p>
                        )}
                        {relationshipStatus && (
                          <p className="status-text">{relationshipStatus}</p>
                        )}
                      </div>
                    )}

                    <div className="assignment-controls">
                      <button
                        onClick={setSubtasksRelationships}
                        disabled={isSettingRelationships}
                        className="assign-relationships-btn"
                      >
                        {isSettingRelationships ? 'Setting Relationships...' : `Set ${subtasksSelectedTasks.length} Child Relationships`}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
            </>
            ) : (
              <p>Please sign in to use the subtasks management feature.</p>
            )}
          </div>
        );

      case 7:
        return (
          <div className="tab-content">
            <h2>YouTube List to Task</h2>
            {isSignedIn ? (
              <>
            {/* Destination Task List Selection */}
            <div className="task-list-selection-section">
              <h4>Select Destination Task List</h4>
              <div className="form-group">
                <label htmlFor="youtubeTaskList">Choose a task list to create tasks in:</label>
                <select
                  id="youtubeTaskList"
                  value={youtubeTaskList}
                  onChange={(e) => setYoutubeTaskList(e.target.value)}
                  onFocus={() => {
                    if (isSignedIn && !loading) {
                      loadTaskLists();
                    }
                  }}
                  disabled={isProcessingPlaylist}
                  className="form-select"
                >
                  <option value="">Choose a task list...</option>
                  {taskLists.map(list => (
                    <option key={list.id} value={list.id}>{list.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Playlist URL Input */}
            <div className="search-filter-section">
              <h4>YouTube Playlist URL</h4>
              <div className="form-group">
                <label htmlFor="youtubePlaylistUrl">Enter YouTube playlist URL:</label>
                <input
                  type="text"
                  id="youtubePlaylistUrl"
                  value={youtubePlaylistUrl}
                  onChange={(e) => setYoutubePlaylistUrl(e.target.value)}
                  placeholder="https://www.youtube.com/playlist?list=PLkMtr4Yvj1xIPur72DHbVoFIzO3Wo8d31"
                  disabled={isProcessingPlaylist}
                  className="form-input"
                  style={{ width: '100%', marginBottom: '1rem' }}
                />
                <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
                  Example: https://www.youtube.com/playlist?list=PLkMtr4Yvj1xIPur72DHbVoFIzO3Wo8d31
                </p>
              </div>

              {/* Process Button */}
              <div className="form-group">
                <button
                  onClick={processYoutubePlaylist}
                  disabled={!youtubeTaskList || !youtubePlaylistUrl || isProcessingPlaylist}
                  className="assign-btn"
                  style={{ width: '100%' }}
                >
                  {isProcessingPlaylist ? (
                    <>
                      <span className="throbber-inline"></span>
                      Processing Playlist...
                    </>
                  ) : (
                    `Process Playlist`
                  )}
                </button>
              </div>

              {/* Progress Display */}
              {isProcessingPlaylist && (
                <div className="form-group">
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${playlistProgress.total > 0 ? (playlistProgress.current / playlistProgress.total) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <p className="progress-text">
                      {playlistStatus} ({playlistProgress.current}/{playlistProgress.total})
                    </p>
                  </div>
                </div>
              )}

              {/* Status Display */}
              {playlistStatus && !isProcessingPlaylist && (
                <div className="form-group">
                  <p className="status-message">{playlistStatus}</p>
                </div>
              )}
            </div>
            </>
            ) : (
              <p>Please sign in to use the YouTube list feature.</p>
            )}
          </div>
        );

      case 8:
        return (
          <div className="tab-content">
            <h2>Bulk Complete</h2>
            {isSignedIn ? (
              <>
                {/* Task List Selection */}
                <div className="task-list-selection-section">
                  <h4>Select Task List</h4>
                  <p className="section-description">Choose the task list containing tasks you want to mark as complete.</p>
                  <div className="form-group">
                    <label htmlFor="completeTasksList">Task List:</label>
                    <select
                      id="completeTasksList"
                      value={completeTasksList}
                      onChange={(e) => setCompleteTasksList(e.target.value)}
                      className="form-select"
                      disabled={isCompletingTasks}
                    >
                      <option value="">Choose a task list...</option>
                      {taskLists.map(list => (
                        <option key={list.id} value={list.id}>{list.title}</option>
                      ))}
                    </select>
                  </div>
                  {isLoadingCompleteTasks && (
                    <div className="loading-container">
                      <div className="throbber"></div>
                      <p>Loading tasks...</p>
                    </div>
                  )}
                </div>

                {/* Search and Filter Section - Only show if tasks are loaded */}
                {completeTasksList && completeTasks.length > 0 && (
                  <div className="search-filter-section">
                    <h4>Search and Filter Tasks</h4>
                    <p className="section-description">Find specific tasks to mark as complete using search and filters.</p>
                    
                    {/* Search Controls */}
                    <div className="search-controls">
                      <div className="search-row">
                        <input
                          type="text"
                          placeholder="Search tasks..."
                          value={completeSearchTerm}
                          onChange={(e) => setCompleteSearchTerm(e.target.value)}
                          className="search-input"
                          disabled={isCompletingTasks}
                        />
                        <div className="radio-group">
                          <label className="radio-label">
                            <input
                              type="radio"
                              checked={completeSortField === 'title'}
                              onChange={() => setCompleteSortField('title')}
                              disabled={isCompletingTasks}
                            />
                            Title
                          </label>
                          <label className="radio-label">
                            <input
                              type="radio"
                              checked={completeSortField === 'notes'}
                              onChange={() => setCompleteSortField('notes')}
                              disabled={isCompletingTasks}
                            />
                            Notes
                          </label>
                        </div>
                      </div>

                      <div className="filter-row">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={completeCaseSensitive}
                            onChange={(e) => setCompleteCaseSensitive(e.target.checked)}
                            disabled={isCompletingTasks}
                          />
                          Case Sensitive
                        </label>

                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={completeShowDuplicates}
                            onChange={(e) => setCompleteShowDuplicates(e.target.checked)}
                            disabled={isCompletingTasks}
                          />
                          Show Only Duplicates
                        </label>

                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={completeOmitRecurring}
                            onChange={(e) => setCompleteOmitRecurring(e.target.checked)}
                            disabled={isCompletingTasks}
                          />
                          Omit Recurring Tasks
                        </label>

                        <div className="sort-controls">
                          <label>Sort by:</label>
                          <select
                            value={completeSortBy}
                            onChange={(e) => setCompleteSortBy(e.target.value)}
                            className="form-select"
                            disabled={isCompletingTasks}
                          >
                            <option value="alphabetical">A-Z</option>
                            <option value="reverse-alphabetical">Z-A</option>
                            <option value="due-date-earliest">Due Date (Earliest First)</option>
                            <option value="due-date-latest">Due Date (Latest First)</option>
                          </select>
                        </div>
                      </div>

                      {/* Date Filter */}
                      <div className="date-filter-section">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={completeDateFilter.enabled}
                            onChange={(e) => setCompleteDateFilter({...completeDateFilter, enabled: e.target.checked})}
                            disabled={isCompletingTasks}
                          />
                          Filter by due date
                        </label>
                        {completeDateFilter.enabled && (
                          <div className="date-picker-container" style={{marginTop: '12px'}}>
                            <div className="radio-group-vertical" style={{marginBottom: '8px'}}>
                              <label className="radio-label" style={{marginRight: '15px'}}>
                                <input
                                  type="radio"
                                  checked={completeDateFilter.mode === 'exact'}
                                  onChange={() => setCompleteDateFilter({...completeDateFilter, mode: 'exact'})}
                                  disabled={isCompletingTasks}
                                />
                                Exact date
                              </label>
                              <label className="radio-label" style={{marginRight: '15px'}}>
                                <input
                                  type="radio"
                                  checked={completeDateFilter.mode === 'before'}
                                  onChange={() => setCompleteDateFilter({...completeDateFilter, mode: 'before'})}
                                  disabled={isCompletingTasks}
                                />
                                On or before
                              </label>
                              <label className="radio-label" style={{marginRight: '15px'}}>
                                <input
                                  type="radio"
                                  checked={completeDateFilter.mode === 'after'}
                                  onChange={() => setCompleteDateFilter({...completeDateFilter, mode: 'after'})}
                                  disabled={isCompletingTasks}
                                />
                                On or after
                              </label>
                              <label className="radio-label">
                                <input
                                  type="radio"
                                  checked={completeDateFilter.mode === 'range'}
                                  onChange={() => setCompleteDateFilter({...completeDateFilter, mode: 'range'})}
                                  disabled={isCompletingTasks}
                                />
                                Date range
                              </label>
                            </div>
                            {completeDateFilter.mode === 'range' ? (
                              <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                <input
                                  type="date"
                                  value={completeDateFilter.dateStart}
                                  onChange={(e) => setCompleteDateFilter({...completeDateFilter, dateStart: e.target.value})}
                                  className="date-picker"
                                  disabled={isCompletingTasks}
                                />
                                <span>to</span>
                                <input
                                  type="date"
                                  value={completeDateFilter.dateEnd}
                                  onChange={(e) => setCompleteDateFilter({...completeDateFilter, dateEnd: e.target.value})}
                                  className="date-picker"
                                  disabled={isCompletingTasks}
                                />
                              </div>
                            ) : (
                              <input
                                type="date"
                                value={completeDateFilter.date}
                                onChange={(e) => setCompleteDateFilter({...completeDateFilter, date: e.target.value})}
                                className="date-picker"
                                disabled={isCompletingTasks}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Filtered Tasks Display */}
                {completeTasksList && (() => {
                  const pageData = getCompletePageData();
                  return (
                    <>
                      {pageData.totalTasks > 0 ? (
                        <div className="filtered-tasks-section">
                          <h4>Tasks to Complete ({pageData.totalTasks} found)</h4>
                          <p className="section-description">
                            Select tasks to mark as complete. Tasks will be processed serially with verification.
                          </p>

                          {/* Selection Controls */}
                          <div className="selection-controls-section">
                            <div className="selection-buttons">
                              <button
                                onClick={() => setCompleteSelectedTasks(filterAndSortCompleteTasks().map(t => t.id))}
                                className="select-all-btn"
                                disabled={isCompletingTasks}
                              >
                                Select All
                              </button>
                              <button
                                onClick={() => setCompleteSelectedTasks([])}
                                className="clear-all-btn"
                                disabled={isCompletingTasks}
                              >
                                Clear Selection
                              </button>
                            </div>
                            <p style={{marginTop: '8px', fontSize: '0.875rem', color: '#6b7280'}}>
                              {completeSelectedTasks.length} task(s) selected
                            </p>
                          </div>

                          {/* Task List */}
                          <div className="task-list-container">
                            {pageData.tasks.map(task => (
                              <div key={task.id} className="task-item">
                                <label className="task-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={completeSelectedTasks.includes(task.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setCompleteSelectedTasks([...completeSelectedTasks, task.id]);
                                      } else {
                                        setCompleteSelectedTasks(completeSelectedTasks.filter(id => id !== task.id));
                                      }
                                    }}
                                    disabled={isCompletingTasks}
                                  />
                                  <div>
                                    <span className="task-title">{task.title}</span>
                                    {task.notes && <div className="task-notes">{task.notes}</div>}
                                    {task.due && (
                                      <span className="task-due-date">
                                        Due: {new Date(task.due).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </label>
                              </div>
                            ))}
                          </div>

                          {/* Pagination */}
                          {pageData.totalPages > 1 && (
                            <div style={{marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem'}}>
                              <button
                                onClick={() => setCompleteCurrentPage(Math.max(1, completeCurrentPage - 1))}
                                disabled={completeCurrentPage === 1 || isCompletingTasks}
                                className="select-btn"
                              >
                                Previous
                              </button>
                              <span style={{padding: '0.5rem', color: '#374151'}}>
                                Page {pageData.currentPage} of {pageData.totalPages}
                              </span>
                              <button
                                onClick={() => setCompleteCurrentPage(Math.min(pageData.totalPages, completeCurrentPage + 1))}
                                disabled={completeCurrentPage === pageData.totalPages || isCompletingTasks}
                                className="select-btn"
                              >
                                Next
                              </button>
                            </div>
                          )}

                          {/* Mark Complete Button */}
                          <div style={{marginTop: '1.5rem'}}>
                            <button
                              onClick={markTasksComplete}
                              disabled={completeSelectedTasks.length === 0 || isCompletingTasks}
                              className="assign-btn"
                              style={{width: '100%'}}
                            >
                              {isCompletingTasks ? 'Marking Tasks Complete...' : `Mark ${completeSelectedTasks.length} Task(s) as Complete`}
                            </button>
                          </div>

                          {/* Progress Section */}
                          {isCompletingTasks && (
                            <div className="progress-section" style={{marginTop: '1rem'}}>
                              <div className="progress-bar">
                                <div
                                  className="progress-fill"
                                  style={{
                                    width: `${(completeProgress.current / completeProgress.total) * 100}%`
                                  }}
                                />
                              </div>
                              <p className="progress-text">
                                {completeStatus} ({completeProgress.current}/{completeProgress.total})
                              </p>
                            </div>
                          )}

                          {/* Status Message */}
                          {completeStatus && !isCompletingTasks && (
                            <div className="status-message" style={{marginTop: '1rem'}}>
                              <p>{completeStatus}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="empty-list-message">
                          <p>No incomplete tasks found matching your criteria.</p>
                        </div>
                      )}
                    </>
                  );
                })()}

                {!completeTasksList && (
                  <div className="empty-list-message">
                    <p>Please select a task list to begin.</p>
                  </div>
                )}
              </>
            ) : (
              <p>Please sign in to use the bulk complete feature.</p>
            )}
          </div>
        );

      default:
        return (
          <div className="tab-content">
            <h2>Tab {activeTab}</h2>
            <p>Content for Tab {activeTab} - Ready for future functionality</p>
            <p>This tab is available for you to add custom features as we iterate on the application.</p>
          </div>
        );
    }
  };

  if (!isInitialized) {
    return (
      <div className="app">
        <div className="loading">
          <h1>Google Tasks Manager</h1>
          <p>Initializing Google API...</p>
          <p className="loading-note">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Google Tasks Manager</h1>
        <div className="auth-section">
          {isSignedIn ? (
            <div className="auth-info">
              <span className="status-indicator signed-in">✓ Signed In</span>
              <button onClick={handleSignOut} className="auth-btn sign-out">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="auth-info">
              <span className="status-indicator signed-out">○ Not Signed In</span>
              <button onClick={handleSignIn} className="auth-btn sign-in">
                Sign In with Google
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="main">
        <div className="tabs-container">
          <div className="tabs-header" style={{ paddingTop: '16px', height: '136px' }}>
            {tabs.map(tabNumber => (
              <button
                key={tabNumber}
                onClick={() => setActiveTab(tabNumber)}
                className={`tab ${activeTab === tabNumber ? 'active' : ''}`}
              >
                {tabNumber === 1 ? 'Bulk Insert' : tabNumber === 2 ? 'Bulk Set Notes' : tabNumber === 3 ? 'Automatic Notes Entry' : tabNumber === 4 ? 'Due Date' : tabNumber === 5 ? 'Bulk Move' : tabNumber === 6 ? 'Subtasks' : tabNumber === 7 ? 'YouTube List' : tabNumber === 8 ? 'Bulk Complete' : `Tab ${tabNumber}`}
              </button>
            ))}
          </div>

          <div className="tab-content-container">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
// Force rebuild Fri Nov  7 10:55:30 EST 2025
