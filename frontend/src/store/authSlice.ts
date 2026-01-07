import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { candidateService } from '../services/candidate.service';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string | null;
    role: 'candidate' | 'recruiter' | 'admin' | null;
    isVerified: boolean;
    isProfileComplete: boolean;
  } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem('authToken'),
  user: {
    id: localStorage.getItem('userId') || null,
    role: (localStorage.getItem('userRole') as 'candidate' | 'recruiter' | 'admin') || null,
    isVerified: false,
    isProfileComplete: false,
  },
  isLoading: false,
  error: null,
};

// Async thunk to check profile completion
export const checkProfileStatus = createAsyncThunk(
  'auth/checkProfileStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const role = localStorage.getItem('userRole');
      
      if (!token || role !== 'candidate') {
        return { isVerified: false, isProfileComplete: false };
      }

      const response = await candidateService.getProfile();
      return {
        isVerified: true, // Assuming OTP verification is done at registration
        isProfileComplete: response.data?.profileCompleted || false,
      };
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
      }
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { accessToken, user } = action.payload;
      
      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userId', user.id);
      
      state.isAuthenticated = true;
      state.user = {
        id: user.id,
        role: user.role,
        isVerified: true, // Assuming verification happens at login
        isProfileComplete: false, // Will be updated by checkProfileStatus
      };
    },
    logout: (state) => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    setProfileComplete: (state, action) => {
      if (state.user) {
        state.user.isProfileComplete = action.payload;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkProfileStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkProfileStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user.isVerified = action.payload.isVerified;
          state.user.isProfileComplete = action.payload.isProfileComplete;
        }
      })
      .addCase(checkProfileStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { loginSuccess, logout, setProfileComplete, setError, clearError } = authSlice.actions;
export default authSlice.reducer;