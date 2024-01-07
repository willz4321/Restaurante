import { apiRestaurante } from "../../api/apiRestaurante";
import { useDispatch } from "react-redux";
import { setMesasDate } from "../../store/slices/RestauranteSlice";
import { useState } from "react";
 
 
 export const useMesas = () => {
   const [mesas, setMesas] = useState([]); 
   const dispatch = useDispatch();
   
   const asignarMesa = async(idMesa, idEmpleado, idTurno) => {
      
    try {
        const resp = await apiRestaurante.post(`/mesas/${idMesa}/mozos/${idEmpleado}/${idTurno}`)
        getMesas()
        return resp.data
    } catch (error) {
        console.log(error)
    }
   }
   
   const getMesas = async() => {
    try {
        const response = await apiRestaurante.get("/mesas");
         setMesas(response.data)
         dispatch(setMesasDate(response.data))
    } catch (error) {
        console.log(error);
    }
   }

    return {
        mesas,
        getMesas,
        asignarMesa
    };

}
 