import { createSlice } from '@reduxjs/toolkit';

export const RestauranteSlice = createSlice({
  name: 'Restaurante',
  initialState: {

    mesas: [],
    empleados: [],
    ventas : []

    },

  reducers: {
    setMesasDate: (state, {payload}) => {
      state.mesas = payload; 
    },
    setEmpleadosDate: (state, {payload}) => {
      state.empleados = payload;
    },
    setVentasDate: (state, {payload}) => {
      state.ventas = payload;
    }
  },

});
export const {
  
   setVentasDate,
   setMesasDate,
   setEmpleadosDate
   
} = RestauranteSlice.actions;
