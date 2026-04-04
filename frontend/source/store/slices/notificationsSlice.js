import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unreadCount: 0,
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAsRead: (state, action) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item && !item.read) {
        item.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach(i => i.read = true);
      state.unreadCount = 0;
    },
    setNotifications: (state, action) => {
      state.items = action.payload;
      state.unreadCount = action.payload.filter(i => !i.read).length;
    }
  }
});

export const { addNotification, markAsRead, markAllAsRead, setNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
