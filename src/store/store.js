import { configureStore } from '@reduxjs/toolkit'
import { RestauranteSlice } from './slices/RestauranteSlice'
import { authSlice } from './slices/authSlice'

export const store = configureStore({
    reducer: {
      auth: authSlice.reducer,
      Restaurante: RestauranteSlice.reducer
    },
  })