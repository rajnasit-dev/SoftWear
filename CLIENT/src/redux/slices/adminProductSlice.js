import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`;

// Fetch admin products
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchAdminProducts",
  async () => {
    const resp = await axios.get(`${API_URL}/api/admin/products`, {
      headers: {
        Authorization: USER_TOKEN,
      },
    });
    return resp.data;
  }
);

// Create a new product
export const createProduct = createAsyncThunk(
  "adminProducts/createProduct",
  async (productData) => {
    const resp = await axios.post(
      `${API_URL}/api/admin/products`,
      productData,
      {
        headers: {
          Authorization: USER_TOKEN,
        },
      }
    );
    return resp.data;
  }
);

// Update an existing product
export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ id, productData }) => {
    const resp = await axios.put(`${API_URL}/api/products/${id}`,
        productData,
        {
            headers: {
                Authorization: USER_TOKEN,
            }
        }
    )
    return resp.data;
  }
);

// Delete a product
export const deleteProduct = createAsyncThunk('adminProducts/deleteProduct', async (id) => {
    await axios.delete(`${API_URL}/api/products/${id}`, {
        headers: {
            Authorization: USER_TOKEN
        },
    })
    return id;
});

const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        //Fetch Products
        .addCase(fetchAdminProducts.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchAdminProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload;
        })
        .addCase(fetchAdminProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        //Create Product
        .addCase(createProduct.fulfilled, (state, action) => {
            state.products = action.payload;
        })
        //Update Product
        .addCase(updateProduct.fulfilled, (state, action) => {
            const index = state.products.findIndex((product) => {
                product._id === action.payload._id
            });
            if(index !== -1) {
                state.products[index] = action.payload;
            }
        })
        //Delete Product
        .addCase(deleteProduct.fulfilled, (state, action) => {
            state.products = state.filters(
                (product) => product._id !== action.payload
            );
        });
    },
});

export default adminProductSlice.reducer;