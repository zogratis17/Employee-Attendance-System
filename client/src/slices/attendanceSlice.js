import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/attendance';

// Get user token
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token;
};

// Check In
export const checkIn = createAsyncThunk(
  'attendance/checkIn',
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(`${API_URL}/checkin`, {}, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Check Out
export const checkOut = createAsyncThunk(
  'attendance/checkOut',
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(`${API_URL}/checkout`, {}, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get My History
export const getMyHistory = createAsyncThunk(
  'attendance/getMyHistory',
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/my-history`, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get Today Status
export const getTodayStatus = createAsyncThunk(
  'attendance/getTodayStatus',
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/today`, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get All Attendance (Manager)
export const getAllAttendance = createAsyncThunk(
  'attendance/getAllAttendance',
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/all`, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  attendance: [],
  todayStatus: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todayStatus = action.payload;
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(checkOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todayStatus = action.payload;
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getMyHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.attendance = action.payload;
      })
      .addCase(getMyHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTodayStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTodayStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todayStatus = action.payload;
      })
      .addCase(getTodayStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.attendance = action.payload;
      })
      .addCase(getAllAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = attendanceSlice.actions;
export default attendanceSlice.reducer;
