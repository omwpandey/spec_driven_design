import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  dealerCode: string;
  dealerName: string;
  branchCode: string;
  branchName: string;
}

const AUTH_USER_STORAGE_KEY = 'tops.auth.user';

function readStoredUser(): User | null {
  const storedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (!storedUser) return null;

  try {
    const user = JSON.parse(storedUser) as User;
    return typeof user.id === 'string' && typeof user.name === 'string'
      ? user
      : null;
  } catch {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    return null;
  }
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState = (): AuthState => {
  const user = readStoredUser();
  const accessToken = localStorage.getItem('accessToken');

  return {
    user,
    accessToken,
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: !!user || !!accessToken,
    loading: false,
    error: null,
  };
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) throw new Error('Login failed');
      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(action.payload));
    },
    /**
     * Sets auth state from an external identity provider (Microsoft Entra ID).
     * The access token is mirrored to localStorage so the existing axios
     * request interceptor and RouteGuard continue to work unchanged.
     */
    setEntraAuth: (state, action: PayloadAction<{ user: User; accessToken: string | null }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(action.payload.user));
      if (action.payload.accessToken) {
        localStorage.setItem('accessToken', action.payload.accessToken);
      } else {
        localStorage.removeItem('accessToken');
      }
    },
    /** Updates just the access token (e.g. after a silent renewal). */
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
      if (action.payload) {
        localStorage.setItem('accessToken', action.payload);
      } else {
        localStorage.removeItem('accessToken');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(action.payload.user));
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setUser, setEntraAuth, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
