import { Routes, Route,  } from "react-router-dom"
import { Empleados, Mesa, Salon } from "../pages"
import { Navbar } from "../pages/Navbar"
import { Ventas } from "../pages/Ventas"


export const RestauranteRoutes = () => {


  return (
    <>
       <Navbar/>

       <Routes>
         <Route path="/*" element={<Salon/>} />
         <Route path="/mesa/:id" element={<Mesa/>} />
         <Route path="/ventas" element={<Ventas/>} /> 
         <Route path="/empleados" element={<Empleados/>} /> 
       </Routes>

    </>
  )
}
