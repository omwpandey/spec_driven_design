import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  sidebarCollapsed: boolean;
  sidebarOpen: boolean;
  loading: boolean;
  notifications: Notification[];
  breadcrumbs: BreadcrumbItem[];
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  read: boolean;
  timestamp: string;
}

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const initialState: AppState = {
  sidebarCollapsed: true,
  sidebarOpen: true,
  loading: false,
  notifications: [],
  breadcrumbs: [],
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setBreadcrumbs: (state, action: PayloadAction<BreadcrumbItem[]>) => {
      state.breadcrumbs = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      state.notifications.unshift({
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      });
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) notification.read = true;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setSidebarCollapsed,
  setLoading,
  setBreadcrumbs,
  addNotification,
  markNotificationRead,
} = appSlice.actions;

export default appSlice.reducer;
