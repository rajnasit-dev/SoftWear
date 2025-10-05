import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//Fetch All the uers
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async () => {
  const resp = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );
  return resp.data;
});

//Add User
export const addUser = createAsyncThunk(
  "admin/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const resp = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return resp.data;
    } catch (error) {
      rejectWithValue(error.response?.data || {message: "Unknown error"});
    }
  }
);

//Update the user info
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, name, email, role }) => {
    const resp = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
      { name, email, role },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return resp.data;
  }
);

//Delete the user
export const deleteUser = createAsyncThunk("admin/deleteUser", async (id) => {
  await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );
  return id;
});

//SLICE
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Fetch all the Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //Update the User
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const userIndex = state.users.findIndex(
          (user) => user._id === updatedUser._id
        );
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        }
      })

      //Delete the user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      })

      //Add user
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload); // add a new user to a state
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export default adminSlice.reducer