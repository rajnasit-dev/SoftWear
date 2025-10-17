import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "./authSlice"; // adjust path
import {jwtDecode} from "jwt-decode";

// ✅ Helper to check token and return auth header
const getAuthHeader = (dispatch) => {
  const token = localStorage.getItem("userToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      dispatch(logout());
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  } catch {
    dispatch(logout());
    return null;
  }
};

// ✅ LocalStorage helpers
const loadCartFromStorage = () => {
  const stored = localStorage.getItem("cart");
  return stored ? JSON.parse(stored) : { products: [] };
};
const saveCartToStorage = (cart) => localStorage.setItem("cart", JSON.stringify(cart));

// ==========================
// Async Thunks
// ==========================

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
        params: { userId, guestId },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch cart" });
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity, size, color, guestId, userId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
        productId, quantity, size, color, guestId, userId,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to add to cart" });
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ productId, quantity, guestId, userId, size, color }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
        productId, quantity, size, color, guestId, userId,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to update item quantity" });
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, guestId, userId, size, color }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
        data: { productId, guestId, userId, size, color },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to remove from cart" });
    }
  }
);

export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ guestId, user }, { rejectWithValue, dispatch }) => {
    try {
      const headers = getAuthHeader(dispatch);
      if (!headers) return rejectWithValue({ message: "Token expired" });

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
        { guestId, user },
        { headers }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to merge cart" });
    }
  }
);

// ==========================
// Slice
// ==========================

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    const actions = [
      fetchCart,
      addToCart,
      updateCartItemQuantity,
      removeFromCart,
      mergeCart,
    ];

    actions.forEach((action) => {
      builder
        .addCase(action.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(action.fulfilled, (state, action) => {
          state.loading = false;
          state.cart = action.payload;
          saveCartToStorage(action.payload);
        })
        .addCase(action.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || "Something went wrong";
        });
    });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
