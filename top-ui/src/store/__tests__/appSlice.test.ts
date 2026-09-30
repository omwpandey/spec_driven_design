// @vitest-environment node
import { describe, it, expect } from 'vitest';
import appReducer, {
  toggleSidebar,
  setSidebarOpen,
  setSidebarCollapsed,
  setLoading,
  setBreadcrumbs,
  addNotification,
  markNotificationRead,
} from '../slices/appSlice';

describe('appSlice', () => {
  const initialState = {
    sidebarCollapsed: false,
    sidebarOpen: true,
    loading: false,
    notifications: [],
    breadcrumbs: [],
  };

  it('should toggle sidebar', () => {
    const state = appReducer(initialState, toggleSidebar());
    expect(state.sidebarCollapsed).toBe(true);
    const state2 = appReducer(state, toggleSidebar());
    expect(state2.sidebarCollapsed).toBe(false);
  });

  it('should set sidebar collapsed', () => {
    const state = appReducer(initialState, setSidebarCollapsed(true));
    expect(state.sidebarCollapsed).toBe(true);
  });

  it('should set sidebar open', () => {
    const state = appReducer(initialState, setSidebarOpen(false));
    expect(state.sidebarOpen).toBe(false);
    const state2 = appReducer(state, setSidebarOpen(true));
    expect(state2.sidebarOpen).toBe(true);
  });

  it('should set loading', () => {
    const state = appReducer(initialState, setLoading(true));
    expect(state.loading).toBe(true);
    const state2 = appReducer(state, setLoading(false));
    expect(state2.loading).toBe(false);
  });

  it('should set breadcrumbs', () => {
    const breadcrumbs = [
      { label: 'Home', path: '/' },
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Settings' },
    ];
    const state = appReducer(initialState, setBreadcrumbs(breadcrumbs));
    expect(state.breadcrumbs).toHaveLength(3);
    expect(state.breadcrumbs[0].label).toBe('Home');
    expect(state.breadcrumbs[2].label).toBe('Settings');
  });

  it('should clear breadcrumbs', () => {
    const stateWithBreadcrumbs = {
      ...initialState,
      breadcrumbs: [{ label: 'Home', path: '/' }],
    };
    const state = appReducer(stateWithBreadcrumbs, setBreadcrumbs([]));
    expect(state.breadcrumbs).toHaveLength(0);
  });

  it('should add notification', () => {
    const state = appReducer(initialState, addNotification({ message: 'Test', type: 'success', read: false }));
    expect(state.notifications).toHaveLength(1);
    expect(state.notifications[0].message).toBe('Test');
    expect(state.notifications[0].type).toBe('success');
    expect(state.notifications[0].read).toBe(false);
    expect(state.notifications[0].id).toBeDefined();
    expect(state.notifications[0].timestamp).toBeDefined();
  });

  it('should add multiple notifications in order', () => {
    let state = appReducer(initialState, addNotification({ message: 'First', type: 'info', read: false }));
    state = appReducer(state, addNotification({ message: 'Second', type: 'warning', read: false }));
    expect(state.notifications).toHaveLength(2);
    // Newest first (unshift)
    expect(state.notifications[0].message).toBe('Second');
    expect(state.notifications[1].message).toBe('First');
  });

  it('should mark notification as read', () => {
    const stateWithNotification = appReducer(
      initialState,
      addNotification({ message: 'Test', type: 'info', read: false })
    );
    const notifId = stateWithNotification.notifications[0].id;
    const state = appReducer(stateWithNotification, markNotificationRead(notifId));
    expect(state.notifications[0].read).toBe(true);
  });

  it('should not change state when marking non-existent notification', () => {
    const stateWithNotification = appReducer(
      initialState,
      addNotification({ message: 'Test', type: 'info', read: false })
    );
    const state = appReducer(stateWithNotification, markNotificationRead('non-existent-id'));
    expect(state.notifications[0].read).toBe(false);
  });

  it('should support different notification types', () => {
    let state = appReducer(initialState, addNotification({ message: 'Success', type: 'success', read: false }));
    state = appReducer(state, addNotification({ message: 'Error', type: 'error', read: false }));
    state = appReducer(state, addNotification({ message: 'Warning', type: 'warning', read: false }));
    state = appReducer(state, addNotification({ message: 'Info', type: 'info', read: false }));
    expect(state.notifications).toHaveLength(4);
    expect(state.notifications[0].type).toBe('info');
    expect(state.notifications[3].type).toBe('success');
  });
});
