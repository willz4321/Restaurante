import { Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { RestauranteRoutes } from '../restaurante/routes/RestauranteRoutes'
import { Login } from '../restaurante/pages';
import { useEffect } from 'react';

export const AppRouter = () => {
  const {status} = useSelector(state => state.auth);
useEffect(() => {
  console.log(status);
}, [status])

  if(status === "checking"){
    return (
      <h3>Cargando...</h3>
    )
  }
   
  return (
    <Routes>
      {
        (status === 'not-authenticated')
          ?  <Route path="/login" element={ <Login /> } />
          :  <Route path='/*' element={ <RestauranteRoutes /> } />
      }
      <Route path="/*" element={ <Navigate to='/login'/> } />
    </Routes>
  )
}
