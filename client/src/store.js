import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './redux/index.js';

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        })
});

export default store;