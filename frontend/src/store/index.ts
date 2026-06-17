import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  createTransform,
  FLUSH,
  PAUSE, PERSIST,
  persistReducer,
  persistStore,
  PURGE, REGISTER,
  REHYDRATE,
} from 'redux-persist';
import authReducer, { type AuthState } from './slices/authSlice';
import storage from './storage'; // our custom storage engine

// Strip accessToken before saving to localStorage
const authTransform = createTransform<AuthState, AuthState>(
  (inboundState) => ({ ...inboundState, accessToken: null }),
  (outboundState) => outboundState,
  { whitelist: ['auth'] }
);

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage,
    whitelist: ['auth'],
    transforms: [authTransform],
  },
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>; // ← use rootReducer not store.getState
export type AppDispatch = typeof store.dispatch;