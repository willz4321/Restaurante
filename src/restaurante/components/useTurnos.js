import { useDispatch } from "react-redux";
import { useEffect, useState } from "react"
import { apiRestaurante } from "../../api/apiRestaurante";

export const useTurnos = () => {
    const dispatch = useDispatch();
    const [turno, setTurno] = useState();
    
    useEffect(() => {
        const fetchTurnos = async() => {
     
            try {
                const response = await apiRestaurante.get("/turnos");
                setTurno(response.data)
                 console.log(response.data)
            } catch (error) {
                console.log(error);
            }
         };
         fetchTurnos();
       }, [dispatch])
     
        return turno;
}
