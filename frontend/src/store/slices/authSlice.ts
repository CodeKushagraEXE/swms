import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthResponse } from '../../types';

interface AuthState { user: User | null; token: string | null; isAuthenticated: boolean; }

function readStoredUser(): User | null {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'),
    user: readStoredUser(),
    isAuthenticated: !!localStorage.getItem('token'),
  } as AuthState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      const { token, id, name, email, role } = action.payload;
      state.token = token; state.user = { id, name, email, role }; state.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ id, name, email, role }));
    },
    logout: (state) => {
      state.token = null; state.user = null; state.isAuthenticated = false;
      localStorage.removeItem('token'); localStorage.removeItem('user');
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
});
export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
