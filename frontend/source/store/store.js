import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import authReducer from './slices/authSlice.js';
import uiReducer from './slices/uiSlice.js';
import notificationsReducer from './slices/notificationsSlice.js';

// Custom localStorage storage for redux-persist (ESM-safe)
const localStorageEngine = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
};

const authPersistConfig = {
  key: 'auth',
  storage: localStorageEngine,
};

const rootReducer = {
  auth: persistReducer(authPersistConfig, authReducer),
  ui: uiReducer,
  notifications: notificationsReducer
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store);

