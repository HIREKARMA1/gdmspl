import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/api";

const loadUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("gdmspl_admin_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("gdmspl_access_token", data.access_token);
      localStorage.setItem("gdmspl_refresh_token", data.refresh_token);
      localStorage.setItem("gdmspl_admin_user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      const detail = error.response?.data?.detail;
      const message =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
            ? detail.map((d) => d.msg || d).join(", ")
            : error.response?.data?.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

export const fetchMe = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/auth/me");
    localStorage.setItem("gdmspl_admin_user", JSON.stringify(data));
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.detail || "Session expired");
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await api.post("/auth/logout");
  } catch {
    // ignore network errors on logout
  } finally {
    localStorage.removeItem("gdmspl_access_token");
    localStorage.removeItem("gdmspl_refresh_token");
    localStorage.removeItem("gdmspl_admin_user");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    hydrated: false,
    loading: false,
    error: null,
  },
  reducers: {
    hydrateAuth(state) {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("gdmspl_access_token");
      const user = loadUser();
      state.accessToken = token;
      state.user = user;
      state.isAuthenticated = Boolean(token && user);
      state.hydrated = true;
    },
    clearAuthError(state) {
      state.error = null;
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
        state.accessToken = action.payload.access_token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.hydrated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Login failed";
        state.isAuthenticated = false;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.hydrated = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.hydrated = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { hydrateAuth, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
