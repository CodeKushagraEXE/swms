import { createSlice } from '@reduxjs/toolkit';
const uiSlice = createSlice({
  name: 'ui',
  initialState: { darkMode: localStorage.getItem('darkMode') === 'true', sidebarOpen: true },
  reducers: {
    toggleDarkMode: (s) => { s.darkMode = !s.darkMode; localStorage.setItem('darkMode', String(s.darkMode)); },
    toggleSidebar: (s) => { s.sidebarOpen = !s.sidebarOpen; },
    setSidebarOpen: (s, action: { payload: boolean }) => { s.sidebarOpen = action.payload; },
  },
});
export const { toggleDarkMode, toggleSidebar, setSidebarOpen } = uiSlice.actions;
export default uiSlice.reducer;
