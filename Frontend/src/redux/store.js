import { configureStore } from '@reduxjs/toolkit'
import { isLoggedinSlice, toggle } from './slice/toggler'

export const store = configureStore({
    reducer: {
      toggle: isLoggedinSlice.reducer
    },
  })