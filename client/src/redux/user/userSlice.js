import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

const initialState = {
    user: null,
    users: [],
    error: null,
    loading: false,
    role: null,
    token:null
}

export const fetchUsers = createAsyncThunk('user/fetchUsers', async (_, thunkAPI) => {
    try {
        const response = await axios.get('http://localhost:3000/admin/dashboard'); // Adjust API path
        return response.data.users;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true
        },
        signInSuccess: (state, action) => {
            state.token= action.payload.token
            state.loading = false
            state.user = action.payload.user
            state.role = action.payload.isAdmin ? 'admin' : 'user';
            state.error = null
        },
        signInFail: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        updateStart: (state) => {
            state.loading = true
        },
        updateSuccess: (state, action) => {
            state.loading = false
            state.user = action.payload
            state.error = null
        },
        updateFail: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        deleteStart: (state) => {
            state.loading = true
        },
        deleteSuccess: (state, action) => {
            state.loading = false
            state.user = null
            state.error = null
        },
        deleteFail: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        logOut: (state) => {
            state.user = null
            state.role = null;
        },
        deleteStart: (state) => {
            state.loading = true
        },
        deleteSuccess: (state, action) => {
            state.loading = false
            state.user = null
            state.error = null
        },
        deleteFail: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        createUserStart: (state) => {
            state.loading = true
        },
        createUserSuccess: (state, action) => {
            state.loading = false
            state.error = null
        },
        createUserFail: (state, action) => {
            state.loading = false
            state.error = action.payload

        },
        updateUserStart: (state) => {
            state.loading = true
        },
        updateUserSuccess: (state, action) => {
            state.loading = false
            state.user = action.payload
            state.error = null
        },
        updateUserFail: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
})

export const { signInStart, signInSuccess, signInFail, updateStart, updateSuccess, updateFail, deleteFail, deleteStart, deleteSuccess, logOut, createUserStart, createUserSuccess, createUserFail, updateUserStart, updateUserSuccess, updateUserFail, clearError } = userSlice.actions

export default userSlice.reducer