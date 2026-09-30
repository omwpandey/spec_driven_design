import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { APP_DEFAULTS } from '@constants/appDefaults';

/**
 * App Config Slice
 * 
 * Holds dynamic values fetched from API.
 * Pattern: API value when available, static fallback when not.
 * 
 * Usage in components:
 *   const { dealer, user } = useAppSelector(state => state.config);
 *   <Typography>{dealer.name}</Typography>  // Shows API value or fallback
 */

interface DealerInfo {
  code: string;
  name: string;
}

interface BranchInfo {
  code: string;
  name: string;
}

interface UserInfo {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
  position: string;
}

interface AppConfigState {
  dealer: DealerInfo;
  branch: BranchInfo;
  user: UserInfo;
  language: 'en' | 'th';
  loading: boolean;
  error: string | null;
}

const initialState: AppConfigState = {
  dealer: { ...APP_DEFAULTS.dealer },
  branch: { ...APP_DEFAULTS.branch },
  user: { ...APP_DEFAULTS.user },
  language: APP_DEFAULTS.system.language,
  loading: false,
  error: null,
};

// Async thunk to fetch config from API
export const fetchAppConfig = createAsyncThunk(
  'config/fetchAppConfig',
  async (_, { rejectWithValue }) => {
    try {
      // Replace with actual API call when backend is ready
      // const response = await apiService.get('/config');
      // return response.data;

      // For now, simulating API response with defaults
      return {
        dealer: APP_DEFAULTS.dealer,
        branch: APP_DEFAULTS.branch,
        user: APP_DEFAULTS.user,
        language: APP_DEFAULTS.system.language,
      };
    } catch (error) {
      return rejectWithValue('Failed to load configuration');
    }
  }
);

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setDealer: (state, action: PayloadAction<DealerInfo>) => {
      state.dealer = action.payload;
    },
    setBranch: (state, action: PayloadAction<BranchInfo>) => {
      state.branch = action.payload;
    },
    setUser: (state, action: PayloadAction<UserInfo>) => {
      state.user = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'en' | 'th'>) => {
      state.language = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.dealer = action.payload.dealer ?? APP_DEFAULTS.dealer;
        state.branch = action.payload.branch ?? APP_DEFAULTS.branch;
        state.user = action.payload.user ?? APP_DEFAULTS.user;
        state.language = action.payload.language ?? APP_DEFAULTS.system.language;
      })
      .addCase(fetchAppConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Keep fallback values on error
      });
  },
});

export const { setDealer, setBranch, setUser, setLanguage } = configSlice.actions;
export default configSlice.reducer;
